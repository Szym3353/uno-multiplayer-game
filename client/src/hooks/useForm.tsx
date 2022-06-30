import { useMutation } from "@apollo/client";
import { useState } from "react";
import useCommon from "./useCommon";
import { DocumentNode } from "graphql";
import { To } from "react-router-dom";

export default function useForm(
  gql: DocumentNode,
  navigatePath: To,
  storeFunc: any
) {
  console.log("useform check1");
  const [formData, setFormData] = useState<any>();
  const [formErrors, setFormErrors] = useState<null | object>();
  const { dispatch, navigate } = useCommon();

  const [formFunc, { loading }] = useMutation(gql, {
    update(proxy, result) {
      console.log("res?", { ...result.data?.[Object.keys(result.data)[0]] });
      //console.log("in useForm", resObject, ...resObject);
      dispatch(storeFunc({ ...result.data?.[Object.keys(result.data)[0]] }));
      navigate(navigatePath);
    },
    onError(err) {
      console.log("cos sie zjebalo", err);
      if (typeof err.graphQLErrors[0].extensions.errors === "object") {
        setFormErrors(err.graphQLErrors[0].extensions.errors);
      }
    },
    variables: formData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);
    formFunc();
  };

  return { setFormData, formErrors, handleSubmit };
}
