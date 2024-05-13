export class LanguageKeysEn {
  public application = {
    global: {
      applicationName: "Obon"
    },
    components: {
      navbar:{
        createEvent:"Create event",
        myEvents:"My events",
        logout:"Logout",
        login:"Log in",
        register:"Register"
      },
      button:{
        confirm:"Confirm",
        cancel:"Cancel"
      },
      clerkCustomProfile:{
        title:"Additional Information",
        addAditionalInfo:"Add additional information",
        cardTitle:"Update Additional Data",
        cardDescription:"Add optional data to be able to register for certain events.",
        nationalId2Placeholder:"Enter your CPF (Brazilian Taxpayer Registry)",
        nationalId2:"CPF (Brazilian Taxpayer Registry)",
        phone:"Phone",
        phonePlaceholder:"Enter your phone number",
        "toast": {
          "updateDataSucess": "Data edited successfully"
        }
      }
    },
    "pages": {
      "home": {
        "searchPlaceholder": "Search for parties, theater, lectures, and everything you can imagine"
      }
    }
  };
  //alternativas de uso abaixo
  /* public WELCOME_HEADLINE = "Welcome to the app";
  
    public MESSAGES = ({ count }: { count: number }) => {
      return count === 1 ? `${count} Message` : `${count} Messages`;
    };
  
    public GOOD_MORNING = "Good Morning"; */
}
export type LangProps = keyof LanguageKeysEn;
export default LanguageKeysEn;
