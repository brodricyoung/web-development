
// not used currently, backup information storage for now until project is finished

const users = [
                {
                    "teachers": 
                    [
                        {
                        "id": "t001",
                        "name": "Mr. James Carter",
                        "email": "jcarter@schooldistrict.edu",
                        "role": "teacher",
                        "students": ["s001", "s002", "s003", "s004"]
                        },
                        {
                        "id": "t002",
                        "name": "Ms. Laura Nguyen",
                        "email": "lnguyen@schooldistrict.edu",
                        "role": "teacher",
                        "students": ["s005", "s006", "s007", "s008"]
                        }
                    ]
                },

                {
                    "administrators": 
                    [
                        {
                        "id": "a001",
                        "name": "Dr. Rachel Kim",
                        "email": "rkim@schooldistrict.edu",
                        "role": "admin"
                        },
                        {
                        "id": "a002",
                        "name": "Mr. Samuel Lopez",
                        "email": "slopez@schooldistrict.edu",
                        "role": "admin"
                        }
                    ]
                },

                {
                    "students": 
                    [
                        {
                        "id": "s001",
                        "name": "Ava Johnson",
                        "grade": 5,
                        "email": "ava.johnson@student.schooldistrict.edu",
                        "parentIds": ["p001"]
                        },
                        {
                        "id": "s002",
                        "name": "Noah Johnson",
                        "grade": 3,
                        "email": "noah.johnson@student.schooldistrict.edu",
                        "parentIds": ["p001"]
                        },
                        {
                        "id": "s003",
                        "name": "Olivia Smith",
                        "grade": 4,
                        "email": "olivia.smith@student.schooldistrict.edu",
                        "parentIds": ["p002"]
                        },
                        {
                        "id": "s004",
                        "name": "Elijah Brown",
                        "grade": 4,
                        "email": "elijah.brown@student.schooldistrict.edu",
                        "parentIds": ["p003"]
                        },
                        {
                        "id": "s005",
                        "name": "Emma Davis",
                        "grade": 3,
                        "email": "emma.davis@student.schooldistrict.edu",
                        "parentIds": ["p004"]
                        },
                        {
                        "id": "s006",
                        "name": "Liam Garcia",
                        "grade": 3,
                        "email": "liam.garcia@student.schooldistrict.edu",
                        "parentIds": ["p005"]
                        },
                        {
                        "id": "s007",
                        "name": "Sophia Martinez",
                        "grade": 5,
                        "email": "sophia.martinez@student.schooldistrict.edu",
                        "parentIds": ["p006"]
                        },
                        {
                        "id": "s008",
                        "name": "Lucas Martinez",
                        "grade": 2,
                        "email": "lucas.martinez@student.schooldistrict.edu",
                        "parentIds": ["p006"]
                        }
                    ]
                },

                {
                    "parents": 
                    [
                        {
                        "id": "p001",
                        "name": "Sarah Johnson",
                        "email": "sarah.johnson@parentmail.com",
                        "childIds": ["s001", "s002"]
                        },
                        {
                        "id": "p002",
                        "name": "Emily Smith",
                        "email": "emily.smith@parentmail.com",
                        "childIds": ["s003"]
                        },
                        {
                        "id": "p003",
                        "name": "Michael Brown",
                        "email": "michael.brown@parentmail.com",
                        "childIds": ["s004"]
                        },
                        {
                        "id": "p004",
                        "name": "Jessica Davis",
                        "email": "jessica.davis@parentmail.com",
                        "childIds": ["s005"]
                        },
                        {
                        "id": "p005",
                        "name": "Robert Garcia",
                        "email": "robert.garcia@parentmail.com",
                        "childIds": ["s006"]
                        },
                        {
                        "id": "p006",
                        "name": "Angela Martinez",
                        "email": "angela.martinez@parentmail.com",
                        "childIds": ["s007", "s008"]
                        }
                    ]
                }

            ]

export default recipes