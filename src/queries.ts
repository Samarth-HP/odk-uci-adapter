export const getStudentFromUdiseAndClass = (
  udise: number,
  grade_number: number[],
): string =>
  `query MyQuery { data: student(where: {school: {udise: {_eq: ${udise}}}, grade_number: {_in: [${grade_number}]}, is_enabled: {_eq: true}}) {name phone}}`;

export const getStudentFromId = (ids: number[]): string =>
  `query MyQuery {data: student(where: {id: {_in: [${ids}]}, is_enabled: {_eq: true}}) {name phone}}`;

export const getStudentForSLC = (
  grade_number?: number[],
  sessions?: string[],
  districts?: string[],
): string => {
  let query = `query MyQuery {
    data: student(
      where: {
        id: {_eq: 919204}
        is_enabled: {_eq: true}
        %grade_number_query
        school: {
          udise: {_gt: 999999999, _lte: 2147483647}
          is_active: {_eq: true}
          %session_query
          location: {
            %district_query
          }
        }
      }
    ) {
      id
      name
      phone
    }
  }`;

  if (grade_number) {
    query = query.replace(
      '%grade_number_query',
      `grade_number: {_in: [${grade_number}]}`,
    );
  } else {
    query = query.replace('%grade_number_query', '');
  }

  if (sessions) {
    query = query.replace(
      '%session_query',
      `session: {_in: [${sessions.map((x) => `"${x}"`)}]}`,
    );
  } else {
    query = query.replace('%session_query', '');
  }

  if (districts) {
    query = query.replace(
      '%district_query',
      `district: {_in: [${districts.map((x) => `"${x}"`)}]}`,
    );
  } else {
    query = query.replace('%district_query', '');
  }

  return query;
};
