import { Label } from "@radix-ui/react-label";
import { Field, ErrorMessage } from "formik";
import MaskedInput from "react-text-mask";

//Input de texto default que pode receber uma máscara
export const Input = (props: {control : string, disabled?:boolean, label?: string, mask?: (string | RegExp)[], placeholder?: string}) => {
  return (
    <>
      <Label htmlFor={props.control}>{props.label}</Label>
      {props.mask ? (
        <Field name={props.control}>
          {({ field }: any) => (
            <MaskedInput
              {...field}
              disabled={props.disabled}
              type="text"
              mask={props.mask}
              placeholder={props.placeholder}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        </Field>
      ) : (
        <Field
        disabled={props.disabled}
          name={props.control}
          type="text"
          placeholder={props.placeholder}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
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

