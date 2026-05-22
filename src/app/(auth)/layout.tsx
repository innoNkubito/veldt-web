import {
  AuthRoot,
  WordmarkWrapper,
  WordmarkTitle,
  WordmarkSubtitle,
} from "./layout.styled";

// Centered layout for sign-in and sign-up pages.
// Warm background, card centered on screen.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRoot>
      <WordmarkWrapper>
        <WordmarkTitle>Veldt</WordmarkTitle>
        <WordmarkSubtitle>Travel Operations</WordmarkSubtitle>
      </WordmarkWrapper>

      {children}
    </AuthRoot>
  );
}
