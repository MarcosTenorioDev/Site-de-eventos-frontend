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
      button:{
        confirm:"Confirmar",
        cancel:"Cancelar"
      },
      clerkCustomProfile:{
        title:"Informações adicionais",
        addAditionalInfo:"Adicionar informações adicionais",
        cardTitle:"Atualizar dados adicionais",
        cardDescription:"Adicione dados opcionais, para poder se inscrever em determinados eventos.",
        nationalId2Placeholder:"Insira seu CPF",
        nationalId2:"CPF",
        phone:"Telefone",
        phonePlaceholder:"Insira o seu número de telefone",
        toast:{
          updateDataSucess:"Dados editados com sucesso"
        }
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
