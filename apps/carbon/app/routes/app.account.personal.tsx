import { PageTitle } from "~/components/Layout";
import { PersonalDataForm } from "~/modules/Account/Personal";

export default function AccountPersonal() {
  return (
    <>
      <PageTitle
        title="Personal Data"
        subtitle="This information is private and stored in an encrypted format."
      />
      <PersonalDataForm personalData={{}} />
    </>
  );
}
