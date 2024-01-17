// sample-data.ts

export interface SortingCard {
    icon: string;
    arrowIcon: string;
    middleText: string;
    bottomText: string;
    selected: boolean;
  }
  
  export const sortingCards: SortingCard[] = [
    {
      icon: 'arrow-up-outline',
      arrowIcon: '',
      middleText: 'Name',
      bottomText: 'A-Z',
      selected:false
    },
    {
      icon: 'filter-outline',
      arrowIcon: 'arrow-up-outline',
      middleText: 'Date',
      bottomText: 'New to old',
      selected:false
    },
    {
      icon: 'filter-outline',
      arrowIcon: 'arrow-down-outline',
      middleText: 'Date',
      bottomText: 'Old to new',
      selected:false
    },
    {
      icon: 'alert-outline',
      arrowIcon: 'arrow-up-outline',
      middleText: 'Priority',
      bottomText: 'Low to high',
      selected:false
    },
    {
      icon: 'alert-outline',
      arrowIcon: 'arrow-down-outline',
      middleText: 'Priority',
      bottomText: 'High to low',
      selected:false
    },
  ];

 
// Creating an array of objects with an 'id' field for each status
export const arrayOfObjects: { id: number, status: string, selected: boolean }[] = [
    { id: 1, status: "Interested", selected: false },
    { id: 2, status: "Not interested", selected: false },
    { id: 3, status: "Walkin", selected: false },
    { id: 4, status: "Interested To Walkin", selected: false },
    { id: 5, status: "Walkin Not interested", selected: false },
    { id: 6, status: "Interested Next year", selected: false },
    { id: 7, status: "Call Back", selected: false },
    { id: 8, status: "Not Connected", selected: false },
    { id: 9, status: "Call Not Picked", selected: false },
    { id: 10, status: "Busy", selected: false },
    { id: 11, status: "Switch off", selected: false },
    { id: 12, status: "Wrong Number", selected: false },
    { id: 13, status: "Call Waiting", selected: false },
    { id: 14, status: "Call After Degree Exam", selected: false },
    { id: 15, status: "Call After 12th Exam", selected: false },
    { id: 16, status: "Call After 12th Result", selected: false },
    { id: 17, status: "Call After PGCET Exam", selected: false },
    { id: 18, status: "Call After CAT Exam", selected: false },
    { id: 19, status: "Call After CAT Result", selected: false }
  ];
  
  
  export const userData:{ leadName: string, counselorName: string, selected: boolean }[] = [
    {
        leadName: "Prathima",
        counselorName: "sai vinay,Sheeba Sapna",
        selected:false
    },
    {
        leadName: "John",
        counselorName: "Emily,Michael",
        selected:false
    },
    {
        leadName: "Sarah",
        counselorName: "David,Sophie",
        selected:false
    },
    {
        leadName: "Alex",
        counselorName: "Olivia,Ethan",
        selected:false
    },
    {
        leadName: "Emma",
        counselorName: "Jacob,Ava",
        selected:false
    },
    {
        leadName: "Daniel",
        counselorName: "Grace,William",
        selected:false
    },
    {
        leadName: "Sophia",
        counselorName: "Benjamin,Chloe",
        selected:false
    },
    {
        leadName: "Liam",
        counselorName: "Mia,James",
        selected:false
    },
    {
        leadName: "Oliver",
        counselorName: "Ella,Lucas",
        selected:false
    },
    {
        leadName: "Isabella",
        counselorName: "Logan,Harper",
        selected:false
    }
];




  