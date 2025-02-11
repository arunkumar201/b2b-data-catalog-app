import * as z from "zod";

const emailValidation = z.string().email({
	message: "Please Enter valid Email",
});

const passwordValidation = z.string().min(8, {
	message: "Password must be at least 8 characters",
});

export const ZUserLogin = z.object({
	email: emailValidation,
	password: passwordValidation,
	code: z.optional(z.string()),
});
export type TUserLogin = z.infer<typeof ZUserLogin>;

export const ZResetPassword = z.object({
	email: emailValidation,
});

export type TResetPassword = z.infer<typeof ZResetPassword>;

export const ZNewPassword = z.object({
	password: passwordValidation,
	//@ts-ignore
	confirmPassword: passwordValidation.refine((val, ctx) => {
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

export const ZRegisterUser = z.object({
	email: emailValidation,
	password: passwordValidation,
	name: z.string(),
});

export type TRegisterUser = z.infer<typeof ZRegisterUser>;
