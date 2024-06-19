import * as React from 'react';
import Rating from '@mui/material/Rating';
import { api } from '../../service/api';

interface IClassification {
  classification: number,
  idLink: string
}

export default function Classification(props: IClassification) {
  const [value, setValue] = React.useState<number | null>(props.classification);

  const handleClick = (newValue: number | null) => {
    setValue(newValue);
    api.patch(`/api/site/${props.idLink}`, {
      classificacao: newValue
    });
  };

  return (
    <Rating
      name="simple-controlled"
      value={value}
      onChange={(event, newValue) => {
        if (newValue !== null) {
          handleClick(newValue);
        } else {
          handleClick(null); // Tratar a remoção da classificação
        }
      }}
    />
  );
}
