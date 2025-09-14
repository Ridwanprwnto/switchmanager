// utils/defaultData.js
/**
 * Create default datasource structure for new users
 */
const createDefaultDatasource = () => {
    return {
        id: "1",
        name: "SW-RUANG-SERVER",
        ip: "192.168.0.1",
        jenis: "Core Switch",
        sn: "SN-001",
        ch: [
            {
                port: "01",
                segment: "192.168.0.1",
                trunk: "N",
                status: "Y",
                ip: "192.168.0.101",
                keterangan: "Port 01 uplink",
            },
            {
                port: "02",
                segment: "192.168.0.1",
                trunk: "N",
                status: "N",
                ip: "",
                keterangan: "Port 02 available",
            },
        ],
        children: [],
    };
};

/**
 * Create sample switch data for testing
 */
const createSampleData = () => {
    return {
        id: "1",
        name: "SW-MAIN-CORE",
        ip: "192.168.1.1",
        jenis: "Core Switch",
        sn: "SAMPLE-001",
        ch: [
            {
                port: "01",
                segment: "192.168.1.0/24",
                trunk: "Y",
                status: "Y",
                ip: "192.168.1.10",
                keterangan: "Uplink to Router",
            },
            {
                port: "02",
                segment: "192.168.2.0/24",
                trunk: "N",
                status: "Y",
                ip: "192.168.2.1",
                keterangan: "VLAN 10 - Office",
            },
            {
                port: "03",
                segment: "192.168.3.0/24",
                trunk: "N",
                status: "Y",
                ip: "192.168.3.1",
                keterangan: "VLAN 20 - Guest",
            },
        ],
        children: [
            {
                id: "2",
                name: "SW-FLOOR-01",
                ip: "192.168.2.10",
                jenis: "Access Switch",
                sn: "ACCESS-001",
                ch: [
                    {
                        port: "01",
                        segment: "192.168.2.0/24",
                        trunk: "N",
                        status: "Y",
                        ip: "192.168.2.11",
                        keterangan: "Workstation 01",
                    },
                ],
                children: [],
            },
        ],
    };
};

module.exports = {
    createDefaultDatasource,
    createSampleData,
};
