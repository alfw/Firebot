import { ReplaceVariable } from "../../../../types/variables";
import { OutputDataType } from "../../../../shared/variable-constants";
import { EffectTrigger } from "../../../../shared/effect-constants";

const triggers = {};
triggers[EffectTrigger.COMMAND] = true;
triggers[EffectTrigger.EVENT] = true;
triggers[EffectTrigger.MANUAL] = true;
triggers[EffectTrigger.CUSTOM_SCRIPT] = true;
triggers[EffectTrigger.PRESET_LIST] = true;
triggers[EffectTrigger.CHANNEL_REWARD] = true;
triggers[EffectTrigger.QUICK_ACTION] = true;

const model : ReplaceVariable = {
    definition: {
        handle: "useridname",
        description: "The associated underlying user identifying name for the given trigger.",
        triggers: triggers,
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: (trigger) => {
        // We have a few places where this might be set, so we check them all
        // Start with any event data, then we check the regular metadata
        return trigger.metadata?.eventData?.userIdName ??
            trigger.metadata?.eventData?.chatMessage?.userIdName ??
            trigger.metadata?.userIdName ??
            trigger.metadata?.chatMessage?.userIdName;
    }
};

export default model;