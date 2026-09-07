/// -----------------------------
// This hook forces all source files in the repository to have the MPL license header at the start of the file.
/// -----------------------------

const { readFileSync } = require("fs");
const { exit } = require("process");
var proc = require('child_process');

function runAndGetStdout(command, callback) {
    proc.exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};

const MPLv2_header = `/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */`

runAndGetStdout("git diff --cached --name-only --diff-filter=ACMR", function(changedFiles) {
    const filesArray = changedFiles.trim().split("\n");
    // Check that all typescript files have the mpl preamble
    const res = filesArray.filter(file => file.endsWith(".ts"))
        .map(file => {
            const contents = readFileSync(file).toString().replace(/\r\n/g, "\n");
            if (!contents.startsWith(MPLv2_header)) {
                console.log("Missing or malformed MPLv2 license header in file: " + file);
                return false;
            }
            return true;
        });
    if (!res.every(v => v)) {
        exit(1);
    }
});
