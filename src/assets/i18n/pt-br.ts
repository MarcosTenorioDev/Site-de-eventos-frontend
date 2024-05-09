export class LanguageKeysPt {
  public application = {
    global: {
      applicationName: "Obon"
    },
    components: {
      navbar:{
        createEvent:"Criar evento",
        myEvents:"Meus eventos",
        logout:"Sair da conta",
        login:"Acessar conta",
        register:"Cadastre-se"
      },
      clerkCustomProfile:{
        title:"Informações adicionais"
      }
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
