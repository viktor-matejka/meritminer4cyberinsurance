export const convertor = (data: any) => {
  if (!data.externalAdvisor) {
    data.externalAdvisor = "NO";
  } else {
    data.externalAdvisor = "YES"
  }

  switch (data.employeeTraining) {
      case 1:
        data.employeeTraining = "LOW"
        break
      case 2:
        data.employeeTraining = "MEDIUM"
        break
      case 3: 
        data.employeeTraining = "HIGH" 
        break  
  }
  return data

};
