import * as z from "zod";

export const ZemailValidation = z.string().email({
	message: "Please Enter valid Email",
});

export const ZpasswordValidation = z
	.string()
	.min(8, {
		message: "Password must be at least 8 characters long",
	})
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
		message:
			"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	});

export const ZUserLogin = z.object({
	email: ZemailValidation,
	password: ZpasswordValidation,
});
export type TUserLogin = z.infer<typeof ZUserLogin>;

export const ZResetPassword = z.object({
	email: ZemailValidation,
});

export type TResetPassword = z.infer<typeof ZResetPassword>;

export const ZNewPassword = z.object({
	password: ZpasswordValidation,
	//@ts-ignore
	confirmPassword: ZpasswordValidation.refine((val, ctx) => {
		if (val !== ctx.parent.password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Confirm Password should match with password",
			});
		}
		return true;
	}),
});

export type TNewPassword = z.infer<typeof ZNewPassword>;
