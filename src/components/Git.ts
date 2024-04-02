import { execSync } from "child_process";

export default class Git {
	clone({
		url,
		path,
		branch,
		depth,
		singleBranch = true,
	}: {
		url: string;
		path: string;
		branch?: string;
		depth?: number;
		singleBranch: boolean;
	}) {
		execSync(
			`git clone ${url} ${singleBranch ? `--single-branch` : ""} ${branch ? `--branch=${branch}` : ""} ${
				depth ? `--depth=${depth}` : ""
			}`,
			{ cwd: path }
		);
	}
}
