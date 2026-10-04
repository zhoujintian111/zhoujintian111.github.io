# r9 autonomous cloud acceptance

This workflow reads the public r9 page and writes only test evidence. It runs on
the dedicated `qa/3d-r9-20261004` branch. There is no build, merge, Pages, or
deployment step. The website files and publishing branch are preserved.

The initial `QA_MODE: smoke` checks the installed Google Chrome, actual WebGL
draws, context health, and a real screenshot. Only after inspecting that evidence
may the mode be changed to `full`. The full runner always performs the minimum
load check again before testing interactions, views, assembly steps and model
geometry. A failed minimum stops the remaining work.

The runner uses explicit ANGLE SwiftShader software WebGL on the isolated Linux
CI machine, normal HTTPS certificate validation, and real mouse input. It does
not apply the earlier 3fps diagnostic limit or DOM button shortcuts. The report
records actual Chrome/Node versions, runner commit/run ID, rendering backend,
source resource hashes, errors and protected-file hashes.

Dependencies are locked in package-lock.json. The Ubuntu runner image and its
preinstalled Chrome are maintained by GitHub; actual versions are recorded each
time, rather than claimed to be immutable. Evidence is retained as a GitHub
Actions artifact for 30 days and must be retrieved and visually reviewed before
acceptance. Unknown real-world fit, screw lengths, pin assignments and shielding
remain unverified. This validates the website, not the user's local PC or vehicle.

The full runner's screenshots and measured data do not alone certify label
clarity, animation smoothness or physical assembly accuracy. The reviewer must
inspect the actual resulting pictures and state every remaining limitation.
