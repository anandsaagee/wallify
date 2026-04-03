const products = [
    {
        id: "p1",
        title: "Auto Poster #1",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/06beddfd9780ddd3e64b79211b901510.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p2",
        title: "Auto Poster #2",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/2eec79eaef3a802df86e29205d5efb06.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p3",
        title: "Auto Poster #3",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/6f9416d9651432e3570aefa1137f269f.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p4",
        title: "Auto Poster #4",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/7ceec8f6ab9ff5a9bceabd7ceca3f4fd.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p5",
        title: "Auto Poster #5",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260126-WA0109.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p6",
        title: "Auto Poster #6",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260128-WA0012.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p7",
        title: "Auto Poster #7",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260128-WA0013.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p8",
        title: "Auto Poster #8",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260128-WA0014.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p9",
        title: "Auto Poster #9",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260128-WA0015.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p10",
        title: "Auto Poster #10",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260202-WA0062.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p11",
        title: "Auto Poster #11",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260202-WA0064.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p12",
        title: "Auto Poster #12",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/IMG-20260203-WA0001.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p13",
        title: "Auto Poster #13",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-13_18-26-10-431_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p14",
        title: "Auto Poster #14",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-13_18-26-55-472.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p15",
        title: "Auto Poster #15",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-13_18-27-53-233.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p16",
        title: "Auto Poster #16",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-13_18-28-32-149.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p17",
        title: "Auto Poster #17",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-14_23-55-18-899.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p18",
        title: "Auto Poster #18",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-14_23-55-47-474.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p19",
        title: "Auto Poster #19",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-14_23-56-15-948_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p20",
        title: "Auto Poster #20",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-14_23-57-55-892.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p21",
        title: "Auto Poster #21",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-14_23-58-32-174.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p22",
        title: "Auto Poster #22",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-15_00-00-59-560.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p23",
        title: "Auto Poster #23",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-10-35-595.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p24",
        title: "Auto Poster #24",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-13-18-971.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p25",
        title: "Auto Poster #25",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-14-17-736.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p26",
        title: "Auto Poster #26",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-21-21-921.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p27",
        title: "Auto Poster #27",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-22-36-572.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p28",
        title: "Auto Poster #28",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-23-48-212.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p29",
        title: "Auto Poster #29",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-24-50-090.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p30",
        title: "Auto Poster #30",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-29-39-492.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p31",
        title: "Auto Poster #31",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-31-14-264.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p32",
        title: "Auto Poster #32",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-32-52-192.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p33",
        title: "Auto Poster #33",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-34-06-634.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p34",
        title: "Auto Poster #34",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-37-54-084.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p35",
        title: "Auto Poster #35",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-39-44-935.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p36",
        title: "Auto Poster #36",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_25-12-30_21-40-47-758.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p37",
        title: "Auto Poster #37",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-07_12-41-06-244.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p38",
        title: "Auto Poster #38",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-18_20-50-39-315.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p39",
        title: "Auto Poster #39",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-18_22-50-30-532.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p40",
        title: "Auto Poster #40",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-28_07-46-54-832.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p41",
        title: "Auto Poster #41",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-28_07-47-54-929.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p42",
        title: "Auto Poster #42",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-28_07-49-28-043.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p43",
        title: "Auto Poster #43",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-28_07-50-49-980.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p44",
        title: "Auto Poster #44",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-28_07-51-59-334.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p45",
        title: "Auto Poster #45",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-30_11-20-35-756.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p46",
        title: "Auto Poster #46",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-01-30_11-26-46-573.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p47",
        title: "Auto Poster #47",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_18-33-27-303.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p48",
        title: "Auto Poster #48",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_23-06-12-175.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p49",
        title: "Auto Poster #49",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_23-07-40-420.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p50",
        title: "Auto Poster #50",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_23-08-51-973.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p51",
        title: "Auto Poster #51",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_23-21-53-602.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p52",
        title: "Auto Poster #52",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-02_23-28-25-661.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p53",
        title: "Auto Poster #53",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_09-45-25-404_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p54",
        title: "Auto Poster #54",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_09-46-38-566_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p55",
        title: "Auto Poster #55",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_09-47-55-842_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p56",
        title: "Auto Poster #56",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_09-49-22-003_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p57",
        title: "Auto Poster #57",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-35-33-553_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p58",
        title: "Auto Poster #58",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-37-35-575_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p59",
        title: "Auto Poster #59",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-39-13-051_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p60",
        title: "Auto Poster #60",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-43-38-428.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p61",
        title: "Auto Poster #61",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-43-38-428_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p62",
        title: "Auto Poster #62",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-45-29-013_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p63",
        title: "Auto Poster #63",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_10-47-55-009_1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p64",
        title: "Auto Poster #64",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-07_21-47-01-432.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p65",
        title: "Auto Poster #65",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-19-26-579.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p66",
        title: "Auto Poster #66",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-21-23-798.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p67",
        title: "Auto Poster #67",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-23-25-922.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p68",
        title: "Auto Poster #68",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-25-08-463.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p69",
        title: "Auto Poster #69",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-25-44-861.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p70",
        title: "Auto Poster #70",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-28-13-663.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p71",
        title: "Auto Poster #71",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-29-33-631.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p72",
        title: "Auto Poster #72",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-31-16-220.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p73",
        title: "Auto Poster #73",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-10_18-39-40-880.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p74",
        title: "Auto Poster #74",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_14-54-55-434.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p75",
        title: "Auto Poster #75",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_14-56-05-919.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p76",
        title: "Auto Poster #76",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-01-26-560.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p77",
        title: "Auto Poster #77",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-02-52-567.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p78",
        title: "Auto Poster #78",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-05-28-831.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p79",
        title: "Auto Poster #79",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-06-06-700.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p80",
        title: "Auto Poster #80",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-07-39-187.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p81",
        title: "Auto Poster #81",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-08-42-440.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p82",
        title: "Auto Poster #82",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-11-03-422.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p83",
        title: "Auto Poster #83",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-13-09-834.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p84",
        title: "Auto Poster #84",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_15-14-17-138.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p85",
        title: "Auto Poster #85",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_16-56-46-182.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p86",
        title: "Auto Poster #86",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_16-58-34-532.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p87",
        title: "Auto Poster #87",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_16-59-35-407.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p88",
        title: "Auto Poster #88",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-00-44-874.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p89",
        title: "Auto Poster #89",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-01-57-989.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p90",
        title: "Auto Poster #90",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-02-29-137.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p91",
        title: "Auto Poster #91",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-03-40-370.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p92",
        title: "Auto Poster #92",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-03-48-332.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p93",
        title: "Auto Poster #93",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-05-25-140.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p94",
        title: "Auto Poster #94",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-06-20-837.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p95",
        title: "Auto Poster #95",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-06-59-059.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p96",
        title: "Auto Poster #96",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-08-54-366.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p97",
        title: "Auto Poster #97",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-11_17-10-12-081.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p98",
        title: "Auto Poster #98",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-18-25-002.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p99",
        title: "Auto Poster #99",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-19-36-840.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p100",
        title: "Auto Poster #100",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-20-39-498.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p101",
        title: "Auto Poster #101",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-21-32-241.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p102",
        title: "Auto Poster #102",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-22-28-658.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p103",
        title: "Auto Poster #103",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-23-05-885.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p104",
        title: "Auto Poster #104",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-25-13-225.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p105",
        title: "Auto Poster #105",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-26-14-116.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p106",
        title: "Auto Poster #106",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-28-05-093.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p107",
        title: "Auto Poster #107",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-31-27-544.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p108",
        title: "Auto Poster #108",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-32-25-343.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p109",
        title: "Auto Poster #109",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-33-45-094.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p110",
        title: "Auto Poster #110",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-36-06-430.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p111",
        title: "Auto Poster #111",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-37-33-731.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p112",
        title: "Auto Poster #112",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-38-19-668.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p113",
        title: "Auto Poster #113",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-39-25-731.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p114",
        title: "Auto Poster #114",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-40-20-935.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p115",
        title: "Auto Poster #115",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-41-49-306.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p116",
        title: "Auto Poster #116",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-42-32-143.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p117",
        title: "Auto Poster #117",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-44-11-876.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p118",
        title: "Auto Poster #118",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-45-17-528.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p119",
        title: "Auto Poster #119",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-46-03-151.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p120",
        title: "Auto Poster #120",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-47-29-434.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p121",
        title: "Auto Poster #121",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-17_15-48-56-414.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p122",
        title: "Auto Poster #122",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-02-21_12-21-05-782.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p123",
        title: "Auto Poster #123",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-04_07-14-28-646.jpg.jpeg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p124",
        title: "Auto Poster #124",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-04_07-21-04-063.jpg.jpeg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p125",
        title: "Auto Poster #125",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_10-38-47-227.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p126",
        title: "Auto Poster #126",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_10-41-32-083.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p127",
        title: "Auto Poster #127",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_10-54-43-365.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p128",
        title: "Auto Poster #128",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_11-17-36-368.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p129",
        title: "Auto Poster #129",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_11-21-20-672.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p130",
        title: "Auto Poster #130",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_11-24-11-550.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p131",
        title: "Auto Poster #131",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/Picsart_26-03-05_11-25-34-320.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },
    {
        id: "p132",
        title: "Auto Poster #132",
        category: "Automotive",
        basePrice: 33.00,
        image: "img/dec2732f406587b5cb637f1a09e131c1.jpg",
        description: "High-quality premium automotive poster. Perfect for any car enthusiast's wall."
    },

    /* ── Mollywood ──────────────────────────── */
    {
        id: "mw1",
        title: "Mohanlal Legend – Golden Era",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800",
        description: "Iconic tribute to Malayalam cinema's golden era. Premium print on museum-grade paper."
    },
    {
        id: "mw2",
        title: "Mammootty – The Complete Actor",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
        description: "A cinematic tribute to the legendary Mammootty. Perfect for any film lover's wall."
    },
    {
        id: "mw3",
        title: "Premam – Romance in Frames",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
        description: "Inspired by the cult classic Premam. A romantic, artistic poster for your space."
    },
    {
        id: "mw4",
        title: "Lucifer – Rise of Power",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&q=80&w=800",
        description: "Bold and dramatic poster inspired by the blockbuster Lucifer."
    },
    {
        id: "mw5",
        title: "Drishyam – Cinematic Masterpiece",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
        description: "Inspired by the suspense thriller Drishyam. A must-have for Malayalam cinema fans."
    },
    {
        id: "mw6",
        title: "Kerala Café – Art House Vibes",
        category: "Mollywood",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800",
        description: "Minimalist art-house poster inspired by Kerala Café's anthology style."
    },

    /* ── Football ───────────────────────────── */
    {
        id: "fb1",
        title: "Champions League – Glory Nights",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
        description: "Electric atmosphere of Champions League nights. Every fan's dream poster."
    },
    {
        id: "fb2",
        title: "Ronaldo – CR7 Legacy",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1551958219-acbc595d6119?auto=format&fit=crop&q=80&w=800",
        description: "Tribute to the greatest of all time. A premium CR7 art poster."
    },
    {
        id: "fb3",
        title: "Messi – The GOAT Era",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800",
        description: "Lionel Messi tribute print. Celebrate the magic of the little magician."
    },
    {
        id: "fb4",
        title: "World Cup 2026 – The Dream",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800",
        description: "The grandeur of the FIFA World Cup. Inspired by football's biggest stage."
    },
    {
        id: "fb5",
        title: "Premier League – Sunday Fever",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800",
        description: "The passion of Premier League Sundays captured in a stunning print."
    },
    {
        id: "fb6",
        title: "The Beautiful Game – Abstract",
        category: "Football",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800",
        description: "Abstract football art celebrating the beauty of the sport."
    },

    /* ── Anime ──────────────────────────────── */
    {
        id: "an1",
        title: "Naruto – Path of the Hokage",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
        description: "Epic Naruto inspired art print. The journey of a ninja legend."
    },
    {
        id: "an2",
        title: "Attack on Titan – Beyond the Walls",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
        description: "AoT inspired dark-themed art poster. For the brave who face the unknown."
    },
    {
        id: "an3",
        title: "Demon Slayer – Hashira",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&q=80&w=800",
        description: "Stunning Demon Slayer inspired artwork with striking color contrasts."
    },
    {
        id: "an4",
        title: "One Piece – King of Pirates",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&q=80&w=800",
        description: "Celebrate Luffy's grand adventure with this One Piece art poster."
    },
    {
        id: "an5",
        title: "Spirited Away – Miyazaki Dreams",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=800",
        description: "Studio Ghibli inspired art print capturing the magic of Spirited Away."
    },
    {
        id: "an6",
        title: "Tokyo Ghoul – Duality",
        category: "Anime",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?auto=format&fit=crop&q=80&w=800",
        description: "Dark and dramatic Tokyo Ghoul inspired poster exploring themes of duality."
    },

    /* ── Aesthetic ──────────────────────────── */
    {
        id: "ae1",
        title: "Neon Dreams – City at Midnight",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=800",
        description: "Neon-soaked cityscape aesthetic print. Perfect for modern bedrooms."
    },
    {
        id: "ae2",
        title: "Lo-Fi Girl – Study Vibes",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?auto=format&fit=crop&q=80&w=800",
        description: "Chill lo-fi aesthetic print capturing the mood of a rainy study session."
    },
    {
        id: "ae3",
        title: "Cherry Blossom – Sakura Season",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=800",
        description: "Soft and dreamy cherry blossom art for a tranquil aesthetic space."
    },
    {
        id: "ae4",
        title: "Solitude – Minimal Mood Board",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
        description: "Minimalist aesthetic poster perfect for a clean, modern living space."
    },
    {
        id: "ae5",
        title: "Golden Hour – Warm Gradient",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?auto=format&fit=crop&q=80&w=800",
        description: "Warm golden-hour gradient art print for a cozy, aesthetic atmosphere."
    },
    {
        id: "ae6",
        title: "Pastel Sky – Soft Clouds",
        category: "Aesthetic",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        description: "Dreamy pastel sky art for calm, aesthetic bedroom wall decor."
    },

    /* ── Classic Cars ───────────────────────── */
    {
        id: "cc1",
        title: "Ferrari 250 GTO – Italian Legend",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
        description: "The Ferrari 250 GTO – the most legendary racing car ever built. A collector's print."
    },
    {
        id: "cc2",
        title: "Porsche 911 – Timeless Classic",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        description: "The iconic Porsche 911 silhouette. A timeless art print for every enthusiast."
    },
    {
        id: "cc3",
        title: "Mustang 1967 – American Muscle",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
        description: "The legendary 1967 Ford Mustang. Raw American muscle in a premium print."
    },
    {
        id: "cc4",
        title: "Jaguar E-Type – Pure Elegance",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
        description: "Enzo Ferrari called it the most beautiful car ever made. Now on your wall."
    },
    {
        id: "cc5",
        title: "Lamborghini Miura – The Pioneer",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
        description: "The Miura that started it all. The first supercar, now a timeless art piece."
    },
    {
        id: "cc6",
        title: "Mercedes 300SL – Gullwing Glory",
        category: "Classic Cars",
        basePrice: 33.00,
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800",
        description: "The iconic 300SL Gullwing. Mercedes-Benz's most celebrated classic on your wall."
    }
];
