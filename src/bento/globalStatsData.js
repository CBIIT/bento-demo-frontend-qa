import gql from 'graphql-tag';

export const globalStatsData = [
  // A maximum of 6 stats are allowed
  {
    statTitle: 'newPrograms',
    datatable_field: 'program',
    type: 'field',
    statAPI: 'numberOfPrograms',
  },
  {
    statTitle: 'newProjects',
    datatable_field: 'project_acronym',
    type: 'field',
    statAPI: 'numberOfProjects',
  },
  {
    statTitle: 'extra Stat should remove Files',
    datatable_field: 'project_acronym',
    type: 'field',
    statAPI: 'numberOfProjects',
  },
  {
    statTitle: 'newCases',
    datatable_field: 'subject_id',
    type: 'field',
    statAPI: 'numberOfSubjects',
  },
  {
    statTitle: 'samples',
    type: 'array',
    datatable_field: 'samples',
    statAPI: 'numberOfSamples',
  },
  {
    statTitle: 'Assays',
    type: 'array',
    datatable_field: 'lab_procedures',
    statAPI: 'numberOfLabProcedures',
  },
  {
    statTitle: 'files',
    type: 'object',
    datatable_field: 'files',
    datatable_sub_field: 'file_id',
    statAPI: 'numberOfFiles',
  },
];

// --------------- GraphQL query - Retrieve stats details --------------
export const GET_GLOBAL_STATS_DATA_QUERY = gql`{
  numberOfPrograms
  numberOfProjects
  numberOfSubjects
  numberOfSamples
  numberOfLabProcedures
  numberOfFiles
  }
  `;
