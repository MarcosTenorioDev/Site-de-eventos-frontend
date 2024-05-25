import React, { useCallback, useMemo } from "react";
import LanguageKeysPt from "./pt-br";
import LanguageKeysEn from "./en-us";
 

type State = { lang: string; keys: LanguageKeysPt | LanguageKeysEn };

const LangStateContext = React.createContext<State | undefined>(undefined);
const LangUpdaterContext = React.createContext<
  React.Dispatch<React.SetStateAction<string>> | undefined
>(undefined);

function getLanguageKeys(lang: string): LanguageKeysPt | LanguageKeysEn {
  /* switch (lang) {
    case "pt-br":
      return new LanguageKeysPt();
    case "en-us":
      return new LanguageKeysEn();
    default:
      //default português
  } */
  return new LanguageKeysPt();
}

const LangProvider: any = ({ children }: any) => {
  const [lang, setLang] = React.useState<string>(getBrowserLanguage());

  const value = useMemo(() => {
    return {
      lang,
      keys: getLanguageKeys(lang),
    };
  }, [lang]);

  return (
    <LangStateContext.Provider value={value}>
      <LangUpdaterContext.Provider value={setLang}>
        {children}
      </LangUpdaterContext.Provider>
    </LangStateContext.Provider>
  );
};

function getBrowserLanguage(): string {
  const browserLang = navigator.language.toLowerCase();

  return browserLang
}

//garantia que o estado de lang esteja dentro do contexto
function useLangState() {
  const langState = React.useContext(LangStateContext);

  if (langState === undefined) {
    throw new Error("useLangState must be used within a LangProvider");
  }

  return langState;
}

function useT() {
  const langState = useLangState();

  const t = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (path: string, data?: any): string => {
      const keys = langState.keys as LanguageKeysPt | LanguageKeysEn;
      const parts = path.split(".");
      let textItem: any = keys;

      for (const part of parts) {
        textItem = textItem[part];
        if (!textItem) break;
      }

      const str: string = textItem || path;

      return textItem instanceof Function ? textItem(data) : str;
    },
    [langState]
  );

  return t;
}

//retorna a linguagem atual
function useLang() {
  const langState = useLangState();

  return langState.lang;
}

//Para utilizar o setLanguage garantindo que seja utilizado dentro do contexto
function useSetLang() {
  const setLang = React.useContext(LangUpdaterContext);
  if (setLang === undefined) {
    throw new Error("useSetLang must be used within a LangProvider");
  }

  return setLang;
}

export { LangProvider, useSetLang, useT, useLang };
