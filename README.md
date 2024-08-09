# Consistent erroring reproduction of EDR panic

## Description

This repository is a minimal reproduction of a consistent erroring behavior in the EDR panic.

## Steps to reproduce

in Github Actions
1. Clone this repository
2. Run `pnpm install`
3. Run `pnpm run test`

## Expected behavior

The test should pass

## Actual behavior

The test fails with the following error:

```
> @n3xt/blockchain@0.3.0 pretest /home/runner/work/repro-edr-panic/repro-edr-panic
> pnpm compile


> @n3xt/blockchain@0.3.0 compile /home/runner/work/repro-edr-panic/repro-edr-panic
> npx hardhat compile

Nothing to compile
No need to generate any newer typings.

> @n3xt/blockchain@0.3.0 test /home/runner/work/repro-edr-panic/repro-edr-panic
> RUST_BACKTRACE=full node --import tsx --test ./test/**.test.ts

TAP version 13
# Subtest: Utilities
    # Subtest: should have named accounts
    ok 1 - should have named accounts
      ---
      duration_ms: 385.742998
      ...
    # Subtest: named accounts should have a NATIVE balance
    ok 2 - named accounts should have a NATIVE balance
      ---
      duration_ms: 76.008162
      ...
    1..2
ok 1 - Utilities
  ---
  duration_ms: 462.814937
  type: 'suite'
  ...
# token.sol deployed to  0x955AC9b2bC2A69Bf00d9EC55C633116B05844269
# tokenProxy.sol deployed to  0x1071CdcF4b17C612dA09C5cD53e1E2757fB45568
# Subtest: token initialization
    # Subtest: deploys to local node
    ok 1 - deploys to local node
      ---
      duration_ms: 0.246333
      ...
    # Subtest: sets owner as DEFAULT_ADMIN_ROLE
    ok 2 - sets owner as DEFAULT_ADMIN_ROLE
      ---
      duration_ms: 26.594066
      ...
    # Subtest: sets DEFAULT_ADMIN_ROLE role as ADMIN for MINTER/BURNER roles
    ok 3 - sets DEFAULT_ADMIN_ROLE role as ADMIN for MINTER/BURNER roles
      ---
      duration_ms: 61.072343
      ...
    # Subtest: set MINTER, BURNER roles to the named accounts
    ok 4 - set MINTER, BURNER roles to the named accounts
      ---
      duration_ms: 50.337276
      ...
    1..4
ok 2 - token initialization
  ---
  duration_ms: 8384.056733
  type: 'suite'
  ...
# thread '<unnamed>' panicked at /build/crates/edr_provider/src/interval.rs:92:18:
# Failed to send cancellation signal: ()
# stack backtrace:
#    0:     0x7f6f71d52875 - <unknown>
#    1:     0x7f6f71d7a2eb - <unknown>
#    2:     0x7f6f71d4fcdf - <unknown>
#    3:     0x7f6f71d5264e - <unknown>
#    4:     0x7f6f71d53779 - <unknown>
#    5:     0x7f6f71d534bd - <unknown>
#    6:     0x7f6f71d53c13 - <unknown>
#    7:     0x7f6f71d53af4 - <unknown>
#    8:     0x7f6f71d52d39 - <unknown>
#    9:     0x7f6f71d53827 - <unknown>
#   10:     0x7f6f7126b343 - <unknown>
#   11:     0x7f6f7126b7f6 - <unknown>
#   12:     0x7f6f71576cf8 - <unknown>
#   13:     0x7f6f716168fa - <unknown>
#   14:     0x7f6f71615a4d - <unknown>
#   15:     0x7f6f715b242a - <unknown>
#   16:           0xf15f6a - _ZN15node_napi_env__13CallFinalizerEPFvP10napi_env__PvS2_ES2_S2_
#   17:           0xeefddb - _ZThn40_N6v8impl9Reference8FinalizeEv
#   18:           0xf1a872 - _ZZN4node11Environment11CloseHandleI11uv_handle_sZN6v8impl12_GLOBAL__N_118ThreadSafeFunction26CloseHandlesAndMaybeDeleteEbEUlPS2_E_EEvPT_T0_ENUlS6_E_4_FUNES6_
#   19:          0x1e34661 - uv__finish_close
#                                at /home/iojs/build/ws/out/../deps/uv/src/unix/core.c:351:5
#   20:          0x1e34661 - uv__run_closing_handles
#                                at /home/iojs/build/ws/out/../deps/uv/src/unix/core.c:365:5
#   21:          0x1e34661 - uv_run
#                                at /home/iojs/build/ws/out/../deps/uv/src/unix/core.c:463:5
#   22:           0xeca0a0 - _ZN4node11Environment14CleanupHandlesEv
#   23:           0xeca15c - _ZN4node11Environment10RunCleanupEv
#   24:           0xe698d1 - _ZN4node15FreeEnvironmentEPNS_11EnvironmentE
#   25:           0xfc0c80 - _ZN4node16NodeMainInstance3RunEv
#   26:           0xf11fff - _ZN4node5StartEiPPc
#   27:     0x7f6faae29d90 - <unknown>
#   28:     0x7f6faae29e40 - __libc_start_main
#   29:           0xe62b9e - _start
#   30:                0x0 - <unknown>
# fatal runtime error: failed to initiate panic, error 5
# Subtest: test/TOKEN.test.ts
not ok 1 - test/TOKEN.test.ts
  ---
  duration_ms: 21494.332394
  location: '/home/runner/work/repro-edr-panic/repro-edr-panic/test/TOKEN.test.ts:1:1'
  failureType: 'testCodeFailure'
  exitCode: ~
  signal: 'SIGABRT'
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..3
# tests 7
# suites 2
# pass 6
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 21502.476888
 ELIFECYCLE  Test failed. See above for more details.
Error: Process completed with exit code 1.
```

