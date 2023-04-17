import AWS from 'aws-sdk'
import { Octokit } from '@octokit/rest';

// Main function that executes the entire process
async function forkAndSubmitPullRequest(inputParameters) {

    // GitHub repository and pull request configuration
    const secretName = "github-token"; // Name of the secret in AWS Secret Manager
    const addonName = inputParameters.addonName;
    const region = "us-east-1"; // Region where the secret is stored
    const owner = 'elamaran11';
    const repo = 'aws-sleek-transformer';
    const forkOwner = "elamaran11"; // Owner of the forked repository
    const forkName = "aws-sleek-transformer1"; // Name of the forked repository
    const filePath = `./unzipped-${addonName}/${addonName}.tgz`; // Path to the file to be added
    const branchName = `feature/${addonName}`;
    const commitMessage = `Adding ${addonName} Addon to the repository`; // Commit message
    const pullRequestTitle = `Adding ${addonName} Addon`;
    const pullRequestBody = `Adding ${addonName} Addon to the repository`;

    // Create a Secrets Manager client
    const client = new AWS.SecretsManager({
        region: region
    });

    // Retrieve the GitHub token from AWS Secret Manager
    client.getSecretValue({ SecretId: secretName }, (err, data) => {
        if (err) {
        console.error(err);
        } else {
        const token = secret.SecretString;

        // Create an Octokit instance with the GitHub token
        const octokit = new Octokit({
            auth: token
        });

        // Fork the original repository
        octokit.repos.createFork({
            owner: owner,
            repo: repo
        }).then((response) => {
            const forkedRepo = response.data;

            // Create a new branch in the forked repository
            octokit.git.createRef({
            owner: forkOwner,
            repo: forkName,
            ref: `refs/heads/${branchName}`,
            sha: forkedRepo.default_branch
            }).then(() => {
            // Get the contents of the file to be added
            const content = Buffer.from("Hello, World!").toString('base64');

            // Create the new file in the forked repository
            octokit.repos.createOrUpdateFileContents({
                owner: forkOwner,
                repo: forkName,
                path: filePath,
                message: commitMessage,
                content: content,
                branch: branchName
            }).then(() => {
                // Create a Pull Request to merge the changes into the original repository
                octokit.pulls.create({
                owner: owner,
                repo: repo,
                title: pullRequestTitle,
                body: pullRequestBody,
                head: `${forkOwner}:${branchName}`,
                base: forkedRepo.default_branch
                }).then(() => {
                console.log("Pull request submitted successfully!");
                }).catch((err) => {
                console.error("Error creating pull request:", err);
                });
            }).catch((err) => {
                console.error("Error creating file:", err);
            });
            }).catch((err) => {
            console.error("Error creating branch:", err);
            });
        }).catch((err) => {
            console.error("Error forking repository:", err);
        });
        }
    });
}

export default forkAndSubmitPullRequest


