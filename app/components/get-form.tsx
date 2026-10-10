import { useNavigate } from "@tanstack/react-router";

type GetFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  action: string;
};

/**
 * Native GET form semantics (fields become the query string) but navigates
 * client-side instead of doing a full page load.
 */
export function GetForm(props: GetFormProps) {
  const { onSubmit, ...rest } = props;
  const submit = useSubmitForm();

  return (
    <form
      method="GET"
      {...rest}
      onSubmit={(evt) => {
        onSubmit?.(evt);
        if (evt.defaultPrevented) return;
        evt.preventDefault();
        submit(evt.currentTarget);
      }}
    />
  );
}

export function useSubmitForm() {
  const navigate = useNavigate();

  return (form: HTMLFormElement) => {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      if (typeof value === "string") params.append(key, value);
    }
    const action = form.getAttribute("action") ?? "";
    return navigate({ href: `${action}?${params}` });
  };
}
