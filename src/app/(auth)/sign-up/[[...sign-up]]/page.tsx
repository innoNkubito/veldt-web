import { SignUp } from "@clerk/nextjs";
import { signUpAppearance } from "./page.styled";

export default function SignUpPage() {
  return <SignUp appearance={signUpAppearance} />;
}
