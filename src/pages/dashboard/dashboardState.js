import client from '../../utils/graphqlClient';
import { DASHBOARD_QUERY, widgetsData, DASHBOARD_TABLE_QUERY } from '../../bento/dashboardData';
import { statsData as statsCount } from '../../bento/stats';

import {
  getStatDataFromDashboardData,
  getSunburstDataFromDashboardData,
  getDonutDataFromDashboardData,
  filterData,
  getFilters,
  getCheckBoxData,
  customCheckBox,
  transformInitialDataForSunburst,
} from '../../utils/dashboardUtilFunctions';

export const initialState = {
  dashboard: {
    isDataTableUptoDate: false,
    isFetched: false,
    isLoading: false,
    error: '',
    hasError: false,
    stats: {},
    checkboxForAll: {
      data: [],
    },
    subjectOverView: {
      data: [],
    },
    checkbox: {
      data: [],
      defaultPanel: false,
    },
    datatable: {
      filters: [],
      data: [],
    },
    widgets: {},
  },
};

export const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX';
export const RECEIVE_DASHBOARD = 'RECEIVE_DASHBOARD';
export const DASHBOARD_QUERY_ERR = 'DASHBOARD_QUERY_ERR';
export const READY_DASHBOARD = 'READY_DASHBOARD';
export const REQUEST_DASHBOARD = 'REQUEST_DASHBOARD';
export const SINGLE_CHECKBOX = 'SINGLE_CHECKBOX';
export const FETCH_ALL_DATA_FOR_DASHBOARDTABLE = 'FETCH_ALL_DATA_FOR_DASHBOARDTABLE';

// Actions

export const toggleCheckBox = (payload) => ({
  type: TOGGLE_CHECKBOX,
  payload,
});

export const singleCheckBox = (payload) => ({
  type: SINGLE_CHECKBOX,
  payload,
});

function postRequestFetchDataDashboard() {
  return {
    type: REQUEST_DASHBOARD,
  };
}

function receiveDashboard(json) {
  return {
    type: RECEIVE_DASHBOARD,
    payload:
    {
      data: json.data,
    },
  };
}

function errorhandler(error, type) {
  return {
    type,
    error,
  };
}

function readyDashboard() {
  return {
    type: READY_DASHBOARD,
  };
}

function fetchAllDataForDashboardTable(json) {
  return {
    type: FETCH_ALL_DATA_FOR_DASHBOARDTABLE,
    payload:
    {
      data: json.data,
    },
  };
}

function getWidgetsData(input) {
  const donut = widgetsData.reduce((acc, widget) => {
    const Data = widget.type === 'sunburst' ? getSunburstDataFromDashboardData(input, widget.datatable_level1_field, widget.datatable_level2_field) : getDonutDataFromDashboardData(input, widget.datatable_field);
    const label = widget.dataName;
    return { ...acc, [label]: Data };
  }, {});

  return donut;
}

function getWidgetsInitData(data) {
  const donut = widgetsData.reduce((acc, widget) => {
    const Data = widget.type === 'sunburst' ? transformInitialDataForSunburst(data[widget.dataName]) : data[widget.dataName];
    const label = widget.dataName;
    return { ...acc, [label]: Data };
  }, {});

  return donut;
}

function getStatInit(input) {
  const initStats = statsCount.reduce((acc, widget) => (
    { ...acc, [widget.statAPI]: input[widget.statAPI] }
  ), {});
  return initStats;
}

export function getFilteredStat(input) {
  const filteredStats = statsCount.reduce((acc, stat) => (
    {
      ...acc,
      [stat.statAPI]:
       getStatDataFromDashboardData(
         input, stat.type, stat.datatable_field, stat.datatable_sub_field,
       ),
    }
  ), {});
  return filteredStats;
}

// This need to go to dashboard controller

function fetchDashboard() {
  return (dispatch) => {
    dispatch(postRequestFetchDataDashboard());
    return client
      .query({
        query: DASHBOARD_QUERY,
      })
      .then((result) => dispatch(receiveDashboard(result)))
      .catch((error) => dispatch(errorhandler(error, DASHBOARD_QUERY_ERR)));
  };
}

export function fetchAllDataForDataTable() {
  return (dispatch) => {
    client
      .query({
        query: DASHBOARD_TABLE_QUERY,
      })
      .then((result) => dispatch(fetchAllDataForDashboardTable(result)))
      .catch((error) => dispatch(errorhandler(error, DASHBOARD_QUERY_ERR)));
  };
}

function shouldFetchAllDataForDashboardData(state) {
  return !(state.dashboard.isDataTableUptoDate);
}

export function fetchAllDataForDashboardDataTable() {
  return (dispatch, getState) => {
    if (shouldFetchAllDataForDashboardData(getState())) {
      return dispatch(fetchAllDataForDataTable());
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };
}

function shouldFetchDataForDashboardData(state) {
  return !(state.dashboard.isFetched);
}

export function fetchDataForDashboardDataTable() {
  return (dispatch, getState) => {
    if (shouldFetchDataForDashboardData(getState())) {
      return dispatch(fetchDashboard());
    }
    return dispatch(readyDashboard());
  };
}

// End of actions

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SINGLE_CHECKBOX: {
      const dataTableFilters = action.payload;
      const tableData = state.subjectOverView.data.filter((d) => (filterData(d, dataTableFilters)));
      const updatedCheckboxData = dataTableFilters && dataTableFilters.length !== 0
        ? getCheckBoxData(
          state.subjectOverView.data,
          state.checkboxForAll.data,
          state.checkbox.data.filter((d) => action.payload[0].groupName === d.groupName)[0],
          dataTableFilters,
        )
        : state.checkboxForAll.data;
      return {
        ...state,
        stats: getFilteredStat(tableData, dataTableFilters),
        checkbox: {
          data: updatedCheckboxData,
          defaultPanel: action.payload[0].groupName,
        },
        datatable: {
          ...state.datatable,
          data: tableData,
          filters: dataTableFilters,
        },
        widgets: getWidgetsData(tableData),
      };
    }
    // if checkbox status has been changed, dashboard data table need to be update as well.
    case TOGGLE_CHECKBOX: {
      const dataTableFilters = getFilters(state.datatable.filters, action.payload);
      const tableData = state.subjectOverView.data.filter((d) => (filterData(d, dataTableFilters)));
      const updatedCheckboxData = dataTableFilters && dataTableFilters.length !== 0
        ? getCheckBoxData(
          state.subjectOverView.data,
          state.checkboxForAll.data,
          state.checkbox.data.filter((d) => action.payload[0].groupName === d.groupName)[0],
          dataTableFilters,
        )
        : state.checkboxForAll.data;
      return {
        ...state,
        stats: getFilteredStat(tableData, dataTableFilters),
        checkbox: {
          data: updatedCheckboxData,
        },
        datatable: {
          ...state.datatable,
          data: tableData,
          filters: dataTableFilters,
        },
        widgets: getWidgetsData(tableData),
      };
    }
    case RECEIVE_DASHBOARD: {
      // get action data
      const checkboxData = customCheckBox(action.payload.data);
      return action.payload.data
        ? {
          ...state.dashboard,
          isFetched: true,
          isLoading: false,
          hasError: false,
          error: '',
          stats: getStatInit(action.payload.data),
          subjectOverView: {
            data: action.payload.data.subjectOverViewPaged,
          },
          checkboxForAll: {
            data: checkboxData,
          },
          checkbox: {
            data: checkboxData,
          },
          datatable: {
            data: action.payload.data.subjectOverViewPaged,
            filters: [],
          },
          widgets: getWidgetsInitData(action.payload.data),

        } : { ...state };
    }
    case DASHBOARD_QUERY_ERR:
      // get action data
      return {
        ...state,
        hasError: true,
        error: action.error,
        isLoading: false,
        isFetched: false,
      };
    case FETCH_ALL_DATA_FOR_DASHBOARDTABLE:
      return {
        ...state,
        isDataTableUptoDate: true,
        subjectOverView: {
          data: action.payload.data.subjectOverViewPaged,
        },
        datatable: {
          data: action.payload.data.subjectOverViewPaged,
          filters: [],
        },
      };
    case READY_DASHBOARD:
      return {
        ...state,
        isLoading: false,
        isFetched: true,
      };
    case REQUEST_DASHBOARD:
      return { ...state, isLoading: true };
    default:
      return state;
  }
}
