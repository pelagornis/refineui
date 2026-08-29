import { InputOTP, InputOTPSlot } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function InputOTPDemo() {
    return (
        <Looks>
            <Look>
                <InputOTP maxLength={6} aria-label="Verification code">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTP>
            </Look>
        </Looks>
    );
}
