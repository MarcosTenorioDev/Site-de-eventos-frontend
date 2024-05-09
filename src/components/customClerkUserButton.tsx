import { useT } from "@/assets/i18n"
import AdditionalUserInfo from "@/pages/AdditionalUserInfo"
import { UserButton } from "@clerk/clerk-react"
import { PersonIcon } from "@radix-ui/react-icons"

const CustomClerkUserButton = (props: any) => {
    const t = useT()
    const propsShowName = props?.showName ? props?.showName : false
  return (
    <>
    <UserButton afterSignOutUrl='/' showName={propsShowName}>
      <UserButton.UserProfilePage
        label={t("application.components.clerkCustomProfile.title")}
        url="profile"
        labelIcon={<PersonIcon />}
      >
        <AdditionalUserInfo />
      </UserButton.UserProfilePage>
    </UserButton>
    </>
  )
}

export default CustomClerkUserButton