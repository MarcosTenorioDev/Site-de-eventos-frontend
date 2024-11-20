import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { addDays, format } from "date-fns";
import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import { Calendar as CalendarIcon, MapPin, TrashIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import MaskedInput from "react-text-mask";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IAddress } from "@/core/interfaces/Address";
import AddressService from "@/core/services/address.service";
import { formatCep } from "@/core/services/helper.service";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { MultiSelect } from "../ui/multi-select";

interface NumberInputProps {
  control: string;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

//Input de texto default que pode receber uma máscara
export const Input = (props: {
  control: string;
  disabled?: boolean;
  label?: string;
  mask?: (string | RegExp)[];
  placeholder?: string;
  type?: string;
  onBlur?: any;
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onBlur) {
      props.onBlur(e.target.value);
    }
  };
  return (
    <>
      <Label htmlFor={props.control} className="font-primary font-medium">
        {props.label}
      </Label>
      {props.mask ? (
        <Field name={props.control}>
          {({ field }: any) => (
            <MaskedInput
              {...field}
              disabled={props.disabled}
              type={props.type ? props.type : "text"}
              mask={props.mask}
              placeholder={props.placeholder}
              className="flex h-9 w-full rounded-md border text-primary-dark border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
              onBlur={(value: any) => handleBlur(value)}
            />
          )}
        </Field>
      ) : (
        <Field
          onBlur={(value: any) => handleBlur(value)}
          disabled={props.disabled}
          name={props.control}
          type={props.type ? props.type : "text"}
          placeholder={props.placeholder}
          className="flex h-9 w-full rounded-md border text-primary-dark border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}

      <div className="flex items-center">
        <ErrorMessage name={props.control}>
          {(message) => (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                className="cl-internal-1sany6l w-4"
              >
                <path
                  fill="red"
                  fillRule="evenodd"
                  d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-red-500 font-medium ml-1 text-sm">{message}</p>
            </div>
          )}
        </ErrorMessage>
      </div>
    </>
  );
};

export const Select = (props: {
  control: string;
  options: { value: string; label: string }[];
  className?: string;
  labelClassName?: string;
  info?: string;
  children: any;
  disabled?:boolean
}) => {
  const { control, options, className, info, labelClassName, disabled } = props;

  return (
    <div className={`flex flex-col w-full`}>
      <label
        htmlFor={control}
        className={cn("font-primary font-medium", labelClassName)}
      >
        {props.children}
      </label>
      <Field
        as="select"
        id={control}
        name={control}
        disabled={disabled}
        className={cn(
          "flex h-12 w-full font-primary text-primary-dark font-medium items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
      >
        {options.map((option: any) => (
          <option
            key={option.value}
            value={option.value}
            className={`font-medium text-xl text-primary-dark font-primary`}
          >
            {option.label}
          </option>
        ))}
      </Field>
      {info ? info : ""}
      <ErrorMessage name={props.control}>
        {(message) => (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              className="cl-internal-1sany6l w-4"
            >
              <path
                fill="red"
                fillRule="evenodd"
                d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-red-500 font-medium ml-1 text-sm">{message}</p>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export const DateRangePicker = (props: {
  control: string;
  children: any;
  className?: string;
  onSelect?: any;
  buttonClassName?: string;
  labelClassName?: string;
  defaultStartDate?: {
    from: Date;
    to: Date;
  };
  value?: DateRange;
  disabled?: boolean;
}) => {
  const {
    control,
    children,
    className,
    onSelect,
    buttonClassName,
    labelClassName,
    defaultStartDate,
    disabled,
    value,
  } = props;

  const [date, setDate] = useState<DateRange | undefined>(
    defaultStartDate
      ? {
          from: defaultStartDate.from,
          to: defaultStartDate.to,
        }
      : {
          from: new Date(),
          to: addDays(new Date(), 20),
        }
  );

  useEffect(() => {
    if (value) {
      setDate(value);
      return;
    }

    setDate(
      defaultStartDate
        ? {
            from: defaultStartDate.from,
            to: defaultStartDate.to,
          }
        : {
            from: new Date(),
            to: addDays(new Date(), 20),
          }
    );
  }, [value]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onSelect?.(newDate);
  };

  return (
    <div className={cn("grid w-full", className)}>
      <label
        htmlFor={control}
        className={cn("font-primary font-medium", labelClassName)}
      >
        {children}
      </label>
      <Popover >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-medium font-primary bg-white h-12 focus:ring-primary",
              !date && "text-muted-foreground",
              buttonClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd, LLL, y")} -{" "}
                  {format(date.to, "dd, LLL, y")}
                </>
              ) : (
                format(date.from, "dd, LLL, y")
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const DatePicker = (props: {
  className?: string;
  placeHolder: string;
  label?: string;
  control: string;
  onSelect?: (date: Date | undefined) => void;
  value?: Date;
}) => {
  const { className, placeHolder, label, control, onSelect, value } = props;
  const [date, setDate] = useState<Date | undefined>(value);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onSelect) {
      onSelect(selectedDate);
    }
  };

  return (
    <div className={cn("grid w-full", className)}>
      <Label htmlFor={control}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal truncate",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd, LLL, y") : <span>{placeHolder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface IAddressPickerProps {
  onAddressSave: (address: IAddress) => void;
  control: string;
  addressId: string;
}

export const AddressPicker = (props: IAddressPickerProps) => {
  const { onAddressSave, control, addressId } = props;
  const initialValues = {
    id: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  };
  const [address, setAddress] = useState<IAddress>();

  const validationSchema = Yup.object({
    street: Yup.string().required("Rua é obrigatória"),
    number: Yup.string().required("Número é obrigatório"),
    complement: Yup.string(),
    neighborhood: Yup.string().required("Bairro é obrigatório"),
    city: Yup.string().required("Cidade é obrigatória"),
    state: Yup.string().required("Estado é obrigatório"),
    zipCode: Yup.string()
      .required("CEP é obrigatório")
      .matches(/^\d{2}\.\d{3}\-\d{3}$/, "CEP deve estar no formato 00.000-000"),
  });

  const cepMask = [/\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
  const [defaultDisabled, setDefaultDisabled] = useState(true);
  const [addressValues, setAddressValues] = useState(initialValues);
  const addressService = new AddressService();
  const [isLoading, setIsLoading] = useState(false);
  const searchAddress = async (cep: string) => {
    const formatedCep = cep.replace(".", "").replace("-", "");
    if (!/^\d{2}\.\d{3}-\d{3}$/.test(cep)) {
      console.error("CEP inválido");
      return;
    }

    try {
      const address = await addressService.getApiGovAddress(formatedCep);
      if (/^\d{2}\.\d{3}-\d{3}$/.test(cep) && address.erro) {
        console.log("CEP não encontrado");
        setDefaultDisabled(false);
        return;
      }
      setAddressValues({
        id: "",
        street: address.logradouro || "",
        number: "",
        complement: address.complemento || "",
        neighborhood: address.bairro || "",
        city: address.localidade || "",
        state: address.uf || "",
        zipCode: cep,
      });
      setDefaultDisabled(true);
    } catch (error) {
      setDefaultDisabled(false);
    }
  };

  const onSubmit = async (values: any) => {
    const payload = {
      street: values.street,
      number: values.number,
      complement: values.complement,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode.replace(".", "").replace("-", ""),
    };

    setIsLoading(true);
    try {
      const result = await addressService.postAddress(payload);
      if (result && result.id) {
        onAddressSave(result);
        setAddress(result);
      }
    } catch (error) {
      console.error("Erro ao salvar o endereço:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (addressId) {
      addressService.getAddressById(addressId).then((address) => {
        setAddress(address);
      });
    }
  }, [addressId]);
  return (
    <div className="flex flex-col w-full items-center sm:items-start">
      <Label className="mb-2 text-start w-full font-medium">Endereço</Label>
      {address ? (
        <>
          {" "}
          <div
            className={cn(
              "w-full flex text-black text-wrap text-xs sm:text-sm justify-start py-2 rounded-md shadow-sm ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent border border-input hover:bg-accent hover:text-accent-foreground items-center pl-3",
              !address && "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 min-h-4 min-w-4" />
              <p>
                {address.neighborhood} - {address.street} Nº {address.number},{" "}
                {address.city} / {formatCep(address.zipCode)}
              </p>
            </div>
            <Button
              onClick={() => {
                setAddress(undefined);
                onAddressSave(initialValues);
              }}
              className="bg-transparent text-red-500 shadow-none  h-4 w-4 min-h-4 min-w-4 mx-2 hover:bg-red-500 hover:text-accent p-3"
            >
              {" "}
              <TrashIcon className=" h-4 w-4 min-h-4 min-w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <Dialog>
            <DialogTrigger
              onClick={() => {
                setDefaultDisabled(true);
                setAddressValues(initialValues);
              }}
              className="w-full lg:w-6/12 justify-start"
              asChild
            >
              <Button
                variant={"outline"}
                type="button"
                className={cn(
                  "w-full flex text-wrap text-xs sm:text-sm justify-start py-2 rounded-md shadow-sm ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent",
                  !address && "text-muted-foreground"
                )}
              >
                <MapPin className="mr-2 h-4 w-4 min-h-4 min-w-4" />
                Selecione o endereço do evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-scroll custom-scroll">
              <DialogHeader>
                <DialogTitle>Endereço</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo com os dados do endereço.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Formik
                  initialValues={addressValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  enableReinitialize
                >
                  <Form className="flex flex-col gap-3">
                    <div>
                      <Input
                        control="zipCode"
                        label="CEP"
                        placeholder="CEP"
                        type="text"
                        mask={cepMask}
                        onBlur={(value: any) => searchAddress(value)}
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-5 ">
                      <div className="flex flex-col text-start">
                        <Input
                          control="street"
                          label="Rua"
                          placeholder="Rua"
                          type="text"
                          disabled={defaultDisabled}
                        />
                      </div>
                      <div className="flex flex-col text-start">
                        <Input
                          control="number"
                          label="Número"
                          placeholder="Número"
                          type="text"
                        />
                      </div>
                      <div className="flex flex-col text-start ">
                        <Input
                          control="complement"
                          label="Complemento"
                          placeholder="Complemento"
                          type="text"
                        />
                      </div>
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Bairro"
                        control="neighborhood"
                        label="Bairro"
                        disabled={defaultDisabled}
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        placeholder="Cidade"
                        control="city"
                        label="Cidade"
                        disabled={defaultDisabled}
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Estado"
                        control="state"
                        label="Estado"
                        disabled={defaultDisabled}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="ghost">Cancelar</Button>
                      </DialogClose>
                      <Button
                        variant="default"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Carregando..." : "Salvar"}
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center">
            <ErrorMessage name={control}>
              {(message) => (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    className="cl-internal-1sany6l w-4"
                  >
                    <path
                      fill="red"
                      fillRule="evenodd"
                      d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p className="text-red-500 font-medium ml-1 text-sm">
                    {message}
                  </p>
                </div>
              )}
            </ErrorMessage>
          </div>
        </>
      )}
    </div>
  );
};

export const NumberInput: React.FC<NumberInputProps> = ({
  control,
  label,
  placeholder = "999",
  min = 0,
  max = 999,
  step = 1,
}) => {
  const [field, meta, helpers] = useField(control);
  const [value, setValue] = useState<number>(field.value || min);

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + step;
      setValue(newValue);
      helpers.setValue(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - step;
      setValue(newValue);
      helpers.setValue(newValue);
    }
  };

  return (
    <>
      {label && (
        <Label className="font-primary font-medium flex-grow" htmlFor={control}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center max-w-[8rem]">
        <Button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="bg-gray-100 rounded-r-none hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </Button>

        <Field name={control}>
          {() => (
            <input
              type="text"
              id={`${control}-input`}
              className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                const newValue = Math.max(
                  min,
                  Math.min(max, Number(e.target.value) || min)
                );
                setValue(newValue);
                helpers.setValue(newValue);
              }}
            />
          )}
        </Field>

        <Button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="bg-gray-100 rounded-l-none hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </Button>
      </div>

      {meta.touched && meta.error ? (
        <ErrorMessage name={control}>
          {(message) => (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                className="w-4 h-4 mr-1"
              >
                <path
                  fill="red"
                  fillRule="evenodd"
                  d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {message}
            </div>
          )}
        </ErrorMessage>
      ) : null}
    </>
  );
};

interface FormikMultiSelectProps {
  control: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  placeholder?: string;
  variant?: string;
  animation?: number;
  className?: string;
  fieldClassName?: string;
  info?: React.ReactNode;
  defaultValue?: string[];
  componentClassName?: string;
  children?: any;
  isEmptyMessage?: string;
  maxCount?: number;
  onValueChange?: (value: any[]) => void;
  value: any[]; // Prop adicionada
  disabled?: boolean
}

export const FormikMultiSelect = (props: FormikMultiSelectProps) => {
  const {
    control,
    options,
    placeholder,
    variant,
    animation,
    className,
    maxCount,
    onValueChange,
    defaultValue,
    isEmptyMessage,
    value,
    disabled
  } = props;
  const [field]: any = useField(control);

  const handleValueChange = (newValue: any[]) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col ${props.componentClassName} w-full`}>
      <label
        htmlFor={control}
        className={`${className} font-primary font-semibold`}
      >
        {props.children}
      </label>
      <MultiSelect
        {...field}
        value={value}
        maxCount={maxCount}
        options={options}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        variant={variant}
        animation={animation}
        isEmptyMessage={isEmptyMessage}
        className={
          "flex w-full font-primary min-h-12 text-primary-dark font-medium items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:border-primary focus:outline-none focus:ring-1 hover:bg-white focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        }
        disabled={disabled}
      />
      <ErrorMessage name={control}>
        {(message) => (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              className="w-4 h-4 mr-1"
            >
              <path
                fill="red"
                fillRule="evenodd"
                d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
                clipRule="evenodd"
              ></path>
            </svg>
            {message}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
