Jank is missing a refresh frame. It's bad. It's better to go at a
slower rate than miss a frame. As we need to be on a vsync, that
means at a rate that's an integer fraction of the refresh rate,
(gear). It's practically impossible to detect the arrival of jank
until it happens (and you skip a frame). This means that you're left
with a binary ("bang-bang") input control, which is a challenge.
Every time you experience jank, the user notices, but the only way
to detect the acceptability of a lower gear (faster rate) is to try
it every now and then. We therefore need to keep careful track of the
likelihood of success.

Detected jank always triggers a gear-shift up (assuming not in top
gear already). After a fixed period, the grace period, we try a
gear-shift down. The length of the grace-period auto adjusts. There
are two modes, hunting and moving. Hunting is when close to the
set-point and moves are alternating up/down due to the bang-bang
control. During this phase transition frequency determines the
grace period. Moving is homing in on the correct geat from some
distance, and the grace period is kept short. Two consecutive ups
or downs puts us into moving, alternating into hunting. If a gear
up due to jank occurs after the grace period, the period is
decreased (to keep the system responsive). If it occurs within the
grace period, it is increased (to avoid too many transitions).

Grace period growth and shrinking is by Fibionacci exponentiation,
to give it an easy, small base.
