export class LanguageKeysPt {
  public application = {
    helloWorld: {
      title: "Hello world",
    },
  };
  //exemplos para alternativas de uso abaixo
  /* public WELCOME_HEADLINE = "Bem vindo ao app";
  
    public MESSAGES = ({ count }: { count: number }) => {
      return count === 1 ? `${count} Mensagem` : `${count} Mensagens`;
    };
  
    public GOOD_MORNING = "Bom dia"; */
}

export type LangProps = keyof LanguageKeysPt;
export default LanguageKeysPt;
