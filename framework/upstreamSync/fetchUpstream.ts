import * as fs from 'fs';
import * as path from 'path';
import {exec as execCallback, execSync} from 'child_process';
import {promisify} from 'util';
import * as yaml from 'js-yaml';
import {Config, ControlledElementConfig} from './models';
import {expandTilde} from "./helper";
import micromatch from 'micromatch';

const SYNC_MARKER_FILENAME = '.upstreamSync';

const exec = promisify(execCallback);

const rootPath = process.cwd();
const config = yaml.load(fs.readFileSync(path.resolve(rootPath, 'upstreamSync.config.yaml'), 'utf8')) as Config;
const teachingDevPath = path.resolve(expandTilde(config.teachingDevPath.trim()));
const logDirPath = path.join(rootPath, 'build', 'upstreamSync');

async function pullTeachingDev() {
  if (!fs.existsSync(teachingDevPath)) {
    console.error(`Repo ${teachingDevPath} does not exist.`);
    process.exit(1);
  }

  console.log(`🕊️Performing branch check...`);

  process.chdir(teachingDevPath);

  const currentBranch: string = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (currentBranch !== config.expectedBranch) {
    console.error('Error: teaching-dev is not on the expected branch.');
    console.error(`Expected: ${config.expectedBranch}`);
    console.error(`Current: ${currentBranch}`);
    process.exit(1);
  }

  console.log(`✅  Branch check passed; teaching-dev is on '${config.expectedBranch}' as expected.`);
  console.log('🚜 Performing git pull...');

  try {
    await exec('git pull');
    console.log('✅  Successfully pulled teaching-dev.');
  } catch (error) {
    console.error('Error: Failed to pull teaching-dev.');
    console.error(error);
    process.exit(1);
  }
}

function createRsyncCommand({src, dst, ignore, protect}: ControlledElementConfig): string {
  const excludePatterns = ignore ? ignore.map(pattern => `--exclude='${pattern}'`).join(' ') : '';
  const protectPatterns = protect ? protect.map(pattern => `--filter='protect ${pattern}'`).join(' ') : '';

  return `rsync -av --delete ${excludePatterns} \
                ${protectPatterns} \
                ${path.join(teachingDevPath, src)} \
                ${path.join(rootPath, dst)} \
                --delete-after \
                --prune-empty-dirs`;
}

async function sync() {
  for (const element of config.controlledElements) {
    const rsyncCommand = createRsyncCommand(element);

    try {
      await exec(rsyncCommand);
      console.log(`✅  Rsync command for controlled element ${element.dst} completed successfully.`);
    } catch (error) {
      console.error('Error: Failed to execute rsync.');
      console.error(error);
      process.exit(1);
    }
  }
}

async function getCurrentTeachingDevCommit(): Promise<string> {
  const { stdout: currentCommit } = await exec('git rev-parse HEAD', { cwd: teachingDevPath });
  return currentCommit.trim();
}

async function getChangedFilesSince(): Promise<string[]> {
  const syncMarkerPath = path.join(rootPath, SYNC_MARKER_FILENAME);

  if (!fs.existsSync(syncMarkerPath)) {
    console.log('⚠️ No upstream sync marker yet, can\'t analyze potential changes to non-controlled files.');
    return;
  }

  const upstreamSyncContent = fs.readFileSync(syncMarkerPath, 'utf8');
  const match = upstreamSyncContent.match(/CURRENT_COMMIT=(\w+)/);

  if (!match) {
    throw new Error('Could not find CURRENT_COMMIT in .upstreamSync');
  }

  const lastSyncedCommit = match[1];

  const { stdout } = await exec(
    `git diff --name-only ${lastSyncedCommit}..HEAD`,
    { cwd: teachingDevPath }
  );

  const changedFiles = stdout.trim().split('\n').filter(Boolean);
  const filteredFiles = micromatch(changedFiles, config.watch);

  if (filteredFiles.length > 0) {
    const logFilename = path.join(logDirPath, `${Date.now()}_${lastSyncedCommit}_to_${await getCurrentTeachingDevCommit()}.txt`);
    let fileChangelog = 'Non-controlled files changed since last fetch:\n'
    filteredFiles.forEach((file: string) => {
      fileChangelog += `- ${file}\n`;
    });

    fs.mkdirSync(logDirPath, { recursive: true });
    fs.writeFileSync(logFilename, fileChangelog);

    console.log('--------------------------')
    console.log(fileChangelog);
    console.log(`See log: ${logFilename}`);
    console.log('--------------------------')
  } else {
    console.log('No non-controlled files changed since last fetch. No log file created.');
  }

  console.log('✅  Done.');
}

async function updateSyncMarker(): Promise<void> {
  try {
    const currentCommit = await getCurrentTeachingDevCommit();

    const syncMarkerPath = path.join(rootPath, SYNC_MARKER_FILENAME);
    if (!fs.existsSync(syncMarkerPath)) {
      fs.writeFileSync(syncMarkerPath, '');
    }

    const syncMarkerEntry = `CURRENT_COMMIT=${currentCommit}`;
    fs.writeFileSync(syncMarkerPath, syncMarkerEntry, 'utf8');

    console.log(`✅  Successfully updated ${syncMarkerPath} with commit SHA: ${currentCommit}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function fetchUpstream(): Promise<void> {
  try {
    await pullTeachingDev();
    await sync();
    await getChangedFilesSince();
    await updateSyncMarker()
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

fetchUpstream();
