export class LanguageKeysEn {
  public application = {
    helloWorld: {
      title: "Hello world",
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
