const MODULE_TYPE_VALIDATOR = 1;
const MODULE_TYPE_EXECUTOR = 2;
const MODULE_TYPE_FALLBACK = 3;
const MODULE_TYPE_HOOK = 4;

const EXEC_TYPE_DEFAULT = "0x00";
const EXEC_TYPE_TRY = "0x01";

const CALL_TYPE_CALL = "0x00";
const CALL_TYPE_BATCH = "0x01";
const CALL_TYPE_DELEGATE = "0xff";

export {
  MODULE_TYPE_VALIDATOR,
  MODULE_TYPE_EXECUTOR,
  MODULE_TYPE_FALLBACK,
  MODULE_TYPE_HOOK,
  EXEC_TYPE_DEFAULT,
  EXEC_TYPE_TRY,
  CALL_TYPE_BATCH,
  CALL_TYPE_DELEGATE,
  CALL_TYPE_CALL,
};
