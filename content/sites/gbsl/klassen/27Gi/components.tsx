import Table from "@site/src/app/components/Table";
import termine from './termine.json';
import {SortTimeTableByDate} from "@site/src/app/helpers/time";

export const Terminplan = () => {
  return (
    <Table header={["Datum", "Thema", "Inhalt"]}
           compact
           selectable
           rows={termine}
           order={SortTimeTableByDate()}
    />
  );
}
