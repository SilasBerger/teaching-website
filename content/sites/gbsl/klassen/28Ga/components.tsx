import Table from "@site/src/app/components/Table";
import einzellektion from './einzellektion.json';
import praktikum from "./praktikum.json";
import {SortTimeTableByDate} from "@site/src/app/helpers/time";
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem';

export const Terminplan = () => {
  return (
    <Tabs groupId='modus'>
      <TabItem value='el' label='Einzellektion' >
        <Table
          header={["Datum", "Thema", "Inhalt"]}
          compact
          selectable
          rows={einzellektion}
          order={SortTimeTableByDate()}
        />
      </TabItem>
      <TabItem value='pra' label='Praktikum' >
        <Table
          header={["Datum", "Halbklasse", "Thema", "Inhalt"]}
          compact
          selectable
          rows={praktikum}
          order={SortTimeTableByDate()}
        />
      </TabItem>
    </Tabs>
  );
};