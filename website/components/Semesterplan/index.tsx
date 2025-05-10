import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Table, {iRow} from "@tdev-components/Table";
import {SortTimeTableByDate} from "@tdev/helpers/time";

interface Props {
  termine?: iRow[];
  einzellektion?: iRow[];
  praktikum?: iRow[];
}

const Semesterplan = ({termine, einzellektion, praktikum}: Props) => {
  return (
    <>
      {termine &&
        <Table
          header={["Datum", "Thema", "Inhalt"]}
          compact
          selectable
          rows={termine}
          order={SortTimeTableByDate()}
        />
      }
      {einzellektion && praktikum &&
        <Tabs groupId='modus'>
          <TabItem value='el' label='Einzellektion'>
            <Table
              header={["Datum", "Thema", "Inhalt"]}
              compact
              selectable
              rows={einzellektion}
              order={SortTimeTableByDate()}
            />
          </TabItem>
          <TabItem value='pra' label='Praktikum'>
            <Table
              header={["Datum", "Halbklasse", "Thema", "Inhalt"]}
              compact
              selectable
              rows={praktikum}
              order={SortTimeTableByDate()}
            />
          </TabItem>
        </Tabs>
      }
    </>
  )
}

export default Semesterplan;