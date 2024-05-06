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
        login:"Login",
        register:"Register"
      }
    },

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
