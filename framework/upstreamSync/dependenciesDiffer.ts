import * as path from 'path';
import * as fs from 'fs';
import process from 'process';
import { intersection, difference } from 'lodash';
import { ReportBuilder } from './helper';

interface PackageJson {
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
}

interface DiffReport {
    upgradeable: {
        packageName: string;
        from: string;
        to: string;
    }[];
    downgradeable: {
        packageName: string;
        from: string;
        to: string;
    }[];
    installable: {
        packageName: string;
        version: string;
    }[];
}

const diffPackages = (
    localDeps: { [key: string]: string },
    tdevDeps: { [key: string]: string }
): DiffReport => {
    const localPackages = Object.keys(localDeps);
    const tdevPackages = Object.keys(tdevDeps);

    const commonDeps = intersection(localPackages, tdevPackages);
    const installableDeps = difference(tdevPackages, localPackages);

    return {
        installable: installableDeps.map((packageName) => ({
            packageName: packageName,
            version: tdevDeps[packageName]
        })),
        upgradeable: commonDeps
            .filter((packageName) => localDeps[packageName] < tdevDeps[packageName])
            .map((packageName) => ({
                packageName: packageName,
                from: localDeps[packageName],
                to: tdevDeps[packageName]
            })),
        downgradeable: commonDeps
            .filter((packageName) => localDeps[packageName] > tdevDeps[packageName])
            .map((packageName) => ({
                packageName: packageName,
                from: localDeps[packageName],
                to: tdevDeps[packageName]
            }))
    };
};

const loadPackageJson = (repoPath: string): PackageJson => {
    return JSON.parse(fs.readFileSync(path.resolve(repoPath, 'package.json'), 'utf8'));
};

export const calculateDependenciesDiff = (rootPath: string, teachingDevPath: string, reportBuilder: ReportBuilder): any => {
    const localPackageJson = loadPackageJson(rootPath);
    const tdevPackageJson = loadPackageJson(teachingDevPath);

    const dependenciesDiff = diffPackages(localPackageJson.dependencies, tdevPackageJson.dependencies);
    const devDependenciesDiff = diffPackages(
        localPackageJson.devDependencies,
        tdevPackageJson.devDependencies
    );

    if (dependenciesDiff.installable.length + devDependenciesDiff.installable.length > 0) {
        reportBuilder.appendLine('⚠️ The following additional packages should be installed:');
        dependenciesDiff.installable.length > 0 &&
            reportBuilder.appendLine(
                `- yarn add ${dependenciesDiff.installable.map((entry) => `${entry.packageName}@${entry.version}`).join(' ')}`
            );
        devDependenciesDiff.installable.length > 0 &&
            reportBuilder.appendLine(
                `- yarn add -D ${devDependenciesDiff.installable.map((entry) => `${entry.packageName}@${entry.version}`).join(' ')}`
            );
    }

    // TODO: Recommend upgrades.
    // TODO: Recommend downgrades.
};
