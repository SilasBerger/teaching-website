import * as fs from 'fs';
import * as path from 'path';
import {exec as execCallback, execSync} from 'child_process';
import {promisify} from 'util';
import * as yaml from 'js-yaml';
import {Config, ControlledElementConfig} from './models';
import {expandTilde} from "./helper";

const exec = promisify(execCallback);

const config = yaml.load(fs.readFileSync(path.resolve(__dirname, './config.yaml'), 'utf8')) as Config;
const repoRootPath = process.cwd();
const teachingDevPath = path.resolve(expandTilde(config.teachingDevPath.trim()));

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
                ${path.join(repoRootPath, dst)} \
                --delete-after \
                --prune-empty-dirs`;
}

async function sync() {
  for (const element of config.controlledElements) {
    const rsyncCommand = createRsyncCommand(element);
    console.log(rsyncCommand);

    try {
      await exec(rsyncCommand);
      console.log('Rsync completed successfully.');
    } catch (error) {
      console.error('Error: Failed to execute rsync.');
      console.error(error);
      process.exit(1);
    }
  }
}

async function updateSyncMarker(): Promise<void> {
  try {
    const { stdout: currentCommit } = await exec('git rev-parse HEAD', { cwd: teachingDevPath });
    const trimmedCommit = currentCommit.trim();

    const syncMarkerPath = path.join(repoRootPath, '.upstreamSync');
    if (!fs.existsSync(syncMarkerPath)) {
      fs.writeFileSync(syncMarkerPath, '');
    }

    const syncMarkerEntry = `CURRENT_COMMIT=${trimmedCommit}`;
    fs.writeFileSync(syncMarkerPath, syncMarkerEntry, 'utf8');

    console.log(`✅  Successfully updated ${syncMarkerPath} with commit SHA: ${trimmedCommit}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function fetchUpstream(): Promise<void> {
  try {
    await pullTeachingDev();
    await sync();
    await updateSyncMarker()
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

fetchUpstream();
