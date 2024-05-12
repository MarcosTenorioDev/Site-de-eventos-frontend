import { useT } from "@/assets/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/formInputs/Inputs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { filterDataForm } from "@/core/services/helper.service";
import UserService from "@/core/services/user.service";
import { PlusIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useToastContext } from "@/core/contexts/toasts.context";
import { ToastType } from "@/core/contexts/toasts.context";

const AdditionalUserInfo = () => {
  const t = useT();
  const userService = new UserService();
  const toast = useToastContext();
  const [disableNationalId2, setDisableNationalId2] = useState<boolean>(false);
  const formValuesNotSend: string[] = []
  const [aditionalInfoForm, setAditionalInfoForm] = useState<{
    cpf: string;
    phone: string;
  }>({
    cpf: "",
    phone: "",
  });
  const [loadingComponent, setLoadingComponent] = useState<boolean>(true);
  const [loadButton, setLoadButton] = useState<boolean>(false)

  useEffect(() => {
    try {
      userService.getUser().then((response) => {
        setAditionalInfoForm({ cpf: response.cpf, phone: response.phone });
        setLoadingComponent(false);
        if(response.cpf){
          setDisableNationalId2(true)
          formValuesNotSend.includes('cpf') ? '' : formValuesNotSend.push("cpf")
        }
      });
    } catch {
      setLoadingComponent(false);
    }
  }, []);
  const cpfMask = [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

  const initialValues = {
    cpf: aditionalInfoForm.cpf || "",
    phone: aditionalInfoForm.phone || "",
  };

  //Buscar regex validadora de CPF com cálculo...
  const validationSchema = Yup.object({
    cpf: Yup.string().matches(
      /^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/,
      "CPF inválido"
    ),
    phone: Yup.string(),
  });

  //tratar erro corretamente com exibição de toast..
  const onSubmit = async (values: any) => {
    const payload = filterDataForm(values, formValuesNotSend);
    setLoadButton(true)

    try{
     const data = await userService.patchUserAditionalInfo(payload)
     if (data){
      toast.showToast(t("application.components.clerkCustomProfile.toast.updateDataSucess"), ToastType.Success)
      setLoadButton(false)
      return data
     }
     return
    }catch(err){
      console.log('deu erro')
      setLoadButton(false)
    }
  };

  const LoadingSkeleton = () => {
    return (
      <div className="flex flex-col space-y-3 items-center mb-7 px-6">
        <Skeleton className="h-[100px] w-full rounded-xl bg-gray-300" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 w-10/12 bg-gray-300" />
        </div>
      </div>
    );
  };
  const [ShowCard, setShowCard] = useState<boolean>(false);

  return (
    <>
      <h1 className="font-bold text-md border-b-[1px] pb-4">
        {t("application.components.clerkCustomProfile.title")}
      </h1>
      <div className="py-8 border-b-[1px] flex flex-col sm:flex-row justify-between">
        <p
          className="text-sm text-[#0000ff] cursor-pointer hover:bg-gray-100 p-2 pt-1 h-8 rounded-md flex items-center"
          onClick={() => setShowCard(!ShowCard)}
        >
          <PlusIcon className="mr-2" />
          {t("application.components.clerkCustomProfile.addAditionalInfo")}
        </p>
        {ShowCard ? (
          <Card className="w-full sm:w-[350px]">
            <CardHeader>
              <CardTitle>
                {t("application.components.clerkCustomProfile.cardTitle")}
              </CardTitle>
              <CardDescription>
                {t("application.components.clerkCustomProfile.cardDescription")}
              </CardDescription>
            </CardHeader>
            {loadingComponent ? (
              <LoadingSkeleton />
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <Form>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Input
                          disabled={disableNationalId2}
                          control="cpf"
                          placeholder={t(
                            "application.components.clerkCustomProfile.nationalId2Placeholder"
                          )}
                          mask={cpfMask}
                          label={t(
                            "application.components.clerkCustomProfile.nationalId2"
                          )}
                        />
                        <Label htmlFor="phone">
                          {t("application.components.clerkCustomProfile.phone")}
                        </Label>
                        <Field
                          name="phone"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 bg-slate-200 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
                          render={({ field, form }: any) => (
                            <PhoneInput
                              {...field}
                              placeholder={t(
                                "application.components.clerkCustomProfile.phonePlaceholder"
                              )}
                              country={"br"}
                              buttonStyle={{
                                borderRadius: "6px",
                                backgroundColor: "rgb(226 232 240 / 0.3)",
                                border: "1px solid",
                                borderColor: "hsl(var(--input))",
                              }}
                              inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: true,
                                className:
                                  "flex h-9 w-full rounded-md border border-input pl-12 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50",
                              }}
                              onChange={(phone) =>
                                form.setFieldValue("phone", phone)
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowCard(false)}
                    >
                      {t("application.components.button.cancel")}
                    </Button>
                    <Button type="submit" disabled={loadButton}>
                      {loadButton ?  t("application.components.button.sending") : t("application.components.button.confirm")}
                    </Button>
                  </CardFooter>
                </Form>
              </Formik>
            )}
          </Card>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AdditionalUserInfo;
