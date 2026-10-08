import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Privacy Policy (RA 10173)",
  description:
    "Official Data Privacy Manual of Kamalayang Kapwa Kalikasan in full compliance with the Republic Act No. 10173 (Data Privacy Act of 2012) of the Philippines.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
