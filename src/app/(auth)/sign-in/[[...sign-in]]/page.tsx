import { SignIn } from "@clerk/nextjs";
import { signInAppearance } from "./page.styled";

export default function SignInPage() {
  return <SignIn appearance={signInAppearance} />;
}
