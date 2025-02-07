import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertSystem } from "./AlertSystem";
import { HistoricalData } from "./HistoricalData";
import { SuggestionsPanel } from "./SuggestionsPanel";

interface MainContentProps {
  currentAlertsPage: number;
  currentHistoricalPage: number;
  setCurrentAlertsPage: (page: number) => void;
  setCurrentHistoricalPage: (page: number) => void;
  itemsPerPage: number;
  renderPagination: (
    currentPage: number,
    setPage: (page: number) => void,
    totalPages: number
  ) => JSX.Element;
}

export const MainContent = ({
  currentAlertsPage,
  currentHistoricalPage,
  setCurrentAlertsPage,
  setCurrentHistoricalPage,
  itemsPerPage,
  renderPagination,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Alert System</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertSystem currentPage={currentAlertsPage} itemsPerPage={itemsPerPage} />
            {renderPagination(currentAlertsPage, setCurrentAlertsPage, 3)}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 lg:row-span-2">
        <SuggestionsPanel />
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Historical Data</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoricalData currentPage={currentHistoricalPage} itemsPerPage={itemsPerPage} />
            {renderPagination(currentHistoricalPage, setCurrentHistoricalPage, 5)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};