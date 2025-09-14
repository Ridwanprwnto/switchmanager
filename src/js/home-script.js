$(function () {
    // === DATA SOURCE (akan dimuat dari backend) ===
    var datascource = {};
    var isDataLoaded = false;

    // === FUNGSI UNTUK LOADING OVERLAY ===
    function showLoading(show = true) {
        if (show) {
            $("#loading-overlay").show();
        } else {
            $("#loading-overlay").hide();
        }
    }

    // === FUNGSI UNTUK MENAMPILKAN PESAN ===
    function showMessage(message, type = "success") {
        // Gunakan Utils.showNotification dari config.js
        Utils.showNotification(message, type);
    }

    // === FUNGSI UNTUK LOAD SWITCH DATA DARI BACKEND ===
    function loadSwitchData() {
        showLoading(true);

        ApiHelper.switchRequest({
            endpoint: API_CONFIG.SWITCH_API.ENDPOINTS.SWITCH_DATA,
            method: "GET",
        })
            .then((response) => {
                if (response.success && response.data) {
                    datascource = normalizeDatasource(response.data);
                    isDataLoaded = true;
                    renderChart();
                    showMessage(MESSAGES.LOAD_SUCCESS, "success");
                } else {
                    showMessage(MESSAGES.LOAD_ERROR, "error");
                    initializeDefaultData();
                }
            })
            .catch((error) => {
                ApiHelper.handleError(error, MESSAGES.LOAD_ERROR);
                initializeDefaultData();
            })
            .finally(() => {
                showLoading(false);
            });
    }

    // === FUNGSI UNTUK SAVE SWITCH DATA KE BACKEND ===
    function saveSwitchData(showSuccessMessage = true) {
        if (!isDataLoaded) {
            showMessage("Data belum dimuat, tidak dapat menyimpan", "error");
            return Promise.reject("Data not loaded");
        }

        showLoading(true);

        return ApiHelper.switchRequest({
            endpoint: API_CONFIG.SWITCH_API.ENDPOINTS.SWITCH_DATA,
            method: "POST",
            data: { datasource: normalizeDatasource(datascource) },
        })
            .then((response) => {
                if (response.success) {
                    if (showSuccessMessage) {
                        showMessage(MESSAGES.SAVE_SUCCESS, "success");
                    }
                    return response;
                } else {
                    throw new Error(response.message || MESSAGES.SAVE_ERROR);
                }
            })
            .catch((error) => {
                ApiHelper.handleError(error, MESSAGES.SAVE_ERROR);
                throw error;
            })
            .finally(() => {
                showLoading(false);
            });
    }

    // === INITIALIZE DEFAULT DATA (fallback) ===
    function initializeDefaultData() {
        datascource = Utils.deepClone(DEFAULT_SWITCH_DATA);
        isDataLoaded = true;
        renderChart();
        showMessage("Menggunakan data default karena gagal memuat dari server", "warning");
    }

    // === AUTO-SAVE FUNCTIONALITY ===
    let autoSaveTimeout;
    const debouncedAutoSave = Utils.debounce(() => {
        if (APP_CONFIG.AUTO_SAVE_ENABLED && isDataLoaded) {
            saveSwitchData(false).catch(() => {
                // Silent error untuk auto-save
            });
        }
    }, API_CONFIG.AUTO_SAVE_DELAY);

    function updateAutoSaveStatus() {
        const statusEl = document.getElementById("auto-save-status");
        if (!statusEl) return;

        if (APP_CONFIG.AUTO_SAVE_ENABLED == true) {
            statusEl.textContent = `Auto-save: Enabled (saves ${API_CONFIG.AUTO_SAVE_DELAY / 1000} seconds after changes)`;
            statusEl.className = "auto-save-status enabled";
        } else {
            statusEl.textContent = `Auto-save: Disabled`;
            statusEl.className = "auto-save-status disabled";
        }
    }

    function scheduleAutoSave() {
        updateAutoSaveStatus();

        if (APP_CONFIG.AUTO_SAVE_ENABLED) {
            debouncedAutoSave();
        }
    }

    // === UTILITY FUNCTIONS ===
    function getId() {
        return Utils.generateId();
    }

    // === NORMALIZATION FUNCTION ===
    function normalizeDatasource(node) {
        if (!node) return null;

        const cleanNode = {
            id: node.id || Utils.generateId(),
            name: node.name,
            ip: node.ip || "",
            jenis: node.jenis || "",
            sn: node.sn || "",
            ch: node.ch || [],
            children: [],
        };

        if (node.children && node.children.length > 0) {
            cleanNode.children = node.children.map((child) => normalizeDatasource(child));
        }

        return cleanNode;
    }

    function clearValidationErrors() {
        $(".input-error").removeClass("input-error");
        $(".error-message").remove();
    }

    // === VALIDATION FUNCTIONS ===
    function validateIP(ip) {
        return Utils.validateIP(ip);
    }

    function validateSwitchName(name) {
        return Utils.validateSwitchName(name);
    }

    function checkDuplicateSN(newSN, excludeName = "") {
        function searchSN(node) {
            if (node.name !== excludeName && node.sn === newSN) {
                return true;
            }
            if (node.children) {
                return node.children.some(searchSN);
            }
            return false;
        }
        return searchSN(datascource);
    }

    function validatePortNumber(port) {
        const portNum = parseInt(port, 10);
        return !isNaN(portNum) && portNum >= APP_CONFIG.MIN_PORT && portNum <= APP_CONFIG.MAX_PORTS;
    }

    function showValidationError(element, message) {
        element.addClass("input-error");
        const errorSpan = $(`<span class="error-message">${message}</span>`);
        element.after(errorSpan);
    }

    function validateNodeInputs() {
        clearValidationErrors();
        let isValid = true;
        const errors = [];

        const names = [];
        const ips = [];
        const sns = [];

        $("#new-nodelist li").each(function () {
            const $nameInput = $(this).find(".new-node");
            const $ipInput = $(this).find(".new-ip");
            const $snInput = $(this).find(".new-sn");

            const name = $nameInput.val().trim();
            const ip = $ipInput.val().trim();
            const sn = $snInput.val().trim();

            // Validasi format dan kekosongan
            if (!name) {
                showValidationError($nameInput, "Nama switch tidak boleh kosong");
                errors.push("Nama switch tidak boleh kosong");
                isValid = false;
            } else if (!validateSwitchName(name)) {
                showValidationError($nameInput, "Format nama switch tidak valid (huruf, angka, - atau _)");
                errors.push("Format nama switch tidak valid");
                isValid = false;
            }

            if (!ip) {
                showValidationError($ipInput, "IP address tidak boleh kosong");
                errors.push("IP address tidak boleh kosong");
                isValid = false;
            } else if (!validateIP(ip)) {
                showValidationError($ipInput, "Format IP address tidak valid");
                errors.push("Format IP address tidak valid");
                isValid = false;
            }

            if (!sn) {
                showValidationError($snInput, "SN switch tidak boleh kosong");
                errors.push("SN switch tidak boleh kosong");
                isValid = false;
            } else if (!validateSwitchName(sn)) {
                showValidationError($snInput, "Format SN tidak valid (huruf, angka, - atau _)");
                errors.push("Format SN tidak valid");
                isValid = false;
            }

            // Cek duplikat antar input baru
            if (names.includes(name)) {
                showValidationError($nameInput, `Nama "${name}" duplikat di input`);
                errors.push(`Nama "${name}" duplikat di input`);
                isValid = false;
            }
            if (ips.includes(ip)) {
                showValidationError($ipInput, `IP "${ip}" duplikat di input`);
                errors.push(`IP "${ip}" duplikat di input`);
                isValid = false;
            }
            if (sns.includes(sn)) {
                showValidationError($snInput, `SN "${sn}" duplikat di input`);
                errors.push(`SN "${sn}" duplikat di input`);
                isValid = false;
            }

            names.push(name);
            ips.push(ip);
            sns.push(sn);

            // Cek duplikat dengan data yang sudah ada
            if (checkDuplicateName(name)) {
                showValidationError($nameInput, `Nama switch "${name}" sudah ada`);
                errors.push(`Nama switch "${name}" sudah ada`);
                isValid = false;
            }
            if (checkDuplicateIP(ip)) {
                showValidationError($ipInput, `IP "${ip}" sudah digunakan`);
                errors.push(`IP "${ip}" sudah digunakan`);
                isValid = false;
            }
            if (checkDuplicateSN(sn)) {
                showValidationError($snInput, `SN "${sn}" sudah digunakan`);
                errors.push(`SN "${sn}" sudah digunakan`);
                isValid = false;
            }
        });

        return { isValid, errors };
    }

    function checkDuplicateIP(newIP, excludeName = "") {
        function searchIP(node) {
            if (node.name !== excludeName && node.ip === newIP) {
                return true;
            }
            if (node.children) {
                return node.children.some(searchIP);
            }
            return false;
        }
        return searchIP(datascource);
    }

    function checkDuplicateName(newName, excludeName = "") {
        function searchName(node) {
            if (node.name !== excludeName && node.name === newName) {
                return true;
            }
            if (node.children) {
                return node.children.some(searchName);
            }
            return false;
        }
        return searchName(datascource);
    }

    // === COLLAPSE STATE HELPERS ===
    function getCollapseState() {
        const state = {};
        if (!oc || !oc.$chart) return state;
        oc.$chart.find(".node").each(function () {
            const nodeId = $(this).attr("id");
            if ($(this).closest(".isCollapsedDescendant, .isChildrenCollapsed, .isSiblingsCollapsed, .isCollapsedSibling").length) {
                state[nodeId] = "collapsed";
            } else {
                state[nodeId] = "expanded";
            }
        });
        return state;
    }

    function applyCollapseState(state) {
        if (!oc || !oc.$chart) return;
        oc.$chart.find(".node").each(function () {
            const nodeId = $(this).attr("id");
            if (state[nodeId] === "collapsed") {
                oc.hideDescendants($(this));
            }
        });
    }

    // === TOGGLE ARROWS ===
    function addToggleArrows() {
        if (!oc || !oc.$chart) return;

        oc.$chart.find(".toggle-arrow").remove();

        oc.$chart.find(".node").each(function () {
            const $node = $(this);
            const nodeName = $node.find(".title").text();
            const nodeData = findNodeDataByName(datascource, nodeName);

            if (nodeData && nodeData.children && nodeData.children.length > 0) {
                if ($node.find(".toggle-arrow").length === 0) {
                    const $toggleArrow = $("<i>", {
                        class: "fa fa-bars toggle-arrow",
                        title: "Expand/Collapse",
                    });
                    $node.append($toggleArrow);
                }
            }
        });
    }

    // === CORE FUNCTIONS ===
    var oc;

    function findNodeDataByName(node, name) {
        if (node.name === name) return node;
        if (!node.children) return null;
        for (var child of node.children) {
            var found = findNodeDataByName(child, name);
            if (found) return found;
        }
        return null;
    }

    function findNodeByName(node, name) {
        if (node.name === name) return node;
        if (!node.children) return null;
        for (var c of node.children) {
            var found = findNodeByName(c, name);
            if (found) return found;
        }
        return null;
    }

    function removeNodeByName(node, name) {
        if (!node.children) return;
        node.children = node.children.filter((c) => c.name !== name);
        node.children.forEach((c) => removeNodeByName(c, name));
    }

    function clearSelection() {
        $("#selected-node").val("").data("node", null);
        $("#ch-add-btn").hide();
        $("#btn-update-ch").hide();
        $("#ch-list").empty();
        $("#ch-container").hide();
        $(".orgchart").find(".focused").removeClass("focused");
        $("#new-nodelist").children("li:not(:first)").remove();
        $("#new-nodelist").find("input").val("");
        $("#node-type-panel").find("input").prop("checked", false);
        clearValidationErrors();
    }

    function renderChart(collapseStateBefore) {
        try {
            if (!isDataLoaded || !datascource || Object.keys(datascource).length === 0) {
                $("#chart-container").empty();
                return;
            }

            if (oc) {
                oc.$chartContainer.empty();
            }
            oc = $("#chart-container").orgchart({
                data: datascource,
                createNode: function ($node, data) {
                    if (!data.id) {
                        data.id = getId();
                    }
                    $node[0].id = data.id;

                    var ipText = data.ip ? data.ip : "IP not set";
                    var ipView = $('<div class="ip-address-view"></div>').text(ipText);
                    $node.append(ipView);

                    if (data.children && data.children.length > 0) {
                        $node.find(".toggle-arrow").remove();
                        $("<i>", {
                            class: "fa fa-bars toggle-arrow",
                            title: "Expand/Collapse",
                        }).appendTo($node);
                    }
                },
            });

            if (collapseStateBefore) {
                applyCollapseState(collapseStateBefore);
            }

            setTimeout(function () {
                addToggleArrows();
            }, 200);

            oc.$chartContainer.off("click", ".node");
            oc.$chartContainer.on("click", ".node", function () {
                var $this = $(this);
                var nodeName = $this.find(".title").text();
                $("#selected-node").val(nodeName).data("node", $this);
                var nodeData = findNodeDataByName(datascource, nodeName);
                if (nodeData) {
                    if (!nodeData.ch) {
                        nodeData.ch = [];
                    }
                    $("#ch-container").show();
                    renderChInputs(nodeData.ch, $('input[name="ch-mode"]:checked').val(), nodeData);
                } else {
                    $("#ch-container").hide();
                    $("#ch-list").empty();
                    $("#ch-add-btn").hide();
                    $("#btn-update-ch").hide();
                }
            });

            oc.$chartContainer.off("click", ".orgchart");
            oc.$chartContainer.on("click", ".orgchart", function (event) {
                if (!$(event.target).closest(".node").length) {
                    clearSelection();
                }
            });
        } catch (error) {
            console.error("Error rendering chart:", error);
            showMessage("Error dalam merender chart: " + error.message, "error");
        }
    }

    function renderChInputs(chArray, mode, node) {
        try {
            var $list = $("#ch-list");
            $list.empty();
            if (node) {
                $("#node-name").val(node.name);
                $("#node-ip").val(node.ip || "");
                $("#node-jenis").val(node.jenis || "");
                $("#node-sn").val(node.sn || "");
                if (mode === "edit") {
                    $("#node-name, #node-ip, #node-jenis, #node-sn").prop("readonly", false);
                    $("#ch-add-btn").show();
                } else {
                    $("#node-name, #node-ip, #node-jenis, #node-sn").prop("readonly", true);
                    $("#ch-add-btn").hide();
                }
            }

            chArray.forEach(function (portObj, index) {
                var $li = $("<li></li>");
                var $portLabel = $("<label></label>").text("Port:");
                var $portInput = $('<input type="text" readonly>').val(portObj.port);
                var $segLabel = $("<label></label>").text("Segment:");
                var $segInput = $('<input type="text" class="ch-segment" data-index="' + index + '">').val(portObj.segment);
                if (mode !== "edit") $segInput.prop("readonly", true);

                var $ipLabel = $("<label></label>").text("IP Address:");
                var $ipInput = $('<input type="text" class="ch-ip" data-index="' + index + '">').val(portObj.ip);
                if (mode !== "edit") $ipInput.prop("readonly", true);

                var $ketLabel = $("<label></label>").text("Keterangan:");
                var $ketInput = $('<input type="text" class="ch-keterangan" data-index="' + index + '">').val(portObj.keterangan);
                if (mode !== "edit") $ketInput.prop("readonly", true);

                var $trunkLabel = $("<label></label>").text("Trunk:");
                var $trunkInput = $('<input type="checkbox" class="ch-trunk" data-index="' + index + '">').prop("checked", portObj.trunk === "Y");
                if (mode !== "edit") $trunkInput.prop("disabled", true);

                var $statusLabel = $("<label></label>").text("Status:");
                var $statusInput = $('<input type="checkbox" class="ch-status" data-index="' + index + '">').prop("checked", portObj.status === "Y");
                if (mode !== "edit") $statusInput.prop("disabled", true);

                var $removeBtn = null;
                if (mode === "edit") {
                    $removeBtn = $('<button type="button" class="ch-remove-btn" title="Delete Port">−</button>');
                    $removeBtn.on("click", function () {
                        if (confirm("Apakah Anda yakin ingin menghapus port ini?")) {
                            chArray.splice(index, 1);
                            renderChInputs(chArray, mode, node);
                            showMessage(MESSAGES.PORT_DELETED, "success");
                            scheduleAutoSave();
                        }
                    });
                }

                $li.append($portLabel, $portInput, $segLabel, $segInput, $ipLabel, $ipInput, $ketLabel, $ketInput, $trunkLabel, $trunkInput, $statusLabel, $statusInput);
                if ($removeBtn) {
                    $li.append($removeBtn);
                }
                $list.append($li);
            });

            if (mode === "edit" && chArray.length > 0) {
                $("#btn-update-ch").show();
            } else {
                $("#btn-update-ch").hide();
            }
        } catch (error) {
            console.error("Error rendering port inputs:", error);
            showMessage("Error dalam merender input port: " + error.message, "error");
        }
    }

    // === INITIALIZATION ===
    // Check authentication saat page load
    const token = localStorage.getItem("authToken");
    const userNIK = localStorage.getItem("loggedInNIK");
    const userName = localStorage.getItem("loggedInUser");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Display user info
    $("#user-name").text(`Hai, ${userName.toUpperCase()} (${userNIK})`);

    // Load data dari backend saat initialization
    loadSwitchData();
    updateAutoSaveStatus();

    // Setup refresh timer callback
    RefreshTimer.onCountdownUpdate((countdown) => {
        if (countdown === 0) {
            // Auto refresh saat countdown habis
            loadSwitchData();
        }
    });

    // === EVENT HANDLERS ===

    // Input formatting untuk switch names dan IPs
    $(document).on("input", "input[type=text]", function () {
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(start, end);

        clearValidationErrors();

        if (isDataLoaded) {
            scheduleAutoSave();
        }
    });

    // Chart state toggle
    $('input[name="chart-state"]').on("click", function () {
        var isEdit = this.value === "edit";
        $(".orgchart").toggleClass("edit-state", isEdit);
        $("#edit-panel").toggleClass("edit-state", !isEdit);
        if (isEdit) {
            $(".orgchart")
                .find(".hidden")
                .removeClass("hidden")
                .end()
                .find(".hierarchy")
                .removeClass("isCollapsedDescendant isChildrenCollapsed isSiblingsCollapsed isCollapsedSibling")
                .find(".node")
                .removeClass("slide-up slide-down slide-right slide-left");
        } else {
            $("#btn-reset").trigger("click");
        }
    });

    // Node type selection
    $('input[name="node-type"]').on("click", function () {
        var $this = $(this);
        clearValidationErrors();
        if ($this.val() === "parent") {
            $("#edit-panel").addClass("edit-parent-node");
            $("#new-nodelist").children(":gt(0)").remove();
        } else {
            $("#edit-panel").removeClass("edit-parent-node");
        }
    });

    // Add node input
    $("#btn-add-input").on("click", function () {
        $("#new-nodelist").append(
            "<li>" +
                '<input type="text" class="new-node" placeholder="Nama switch" />' +
                '<input type="text" class="new-ip" placeholder="Alamat IP" />' +
                '<input type="text" class="new-jenis" placeholder="Jenis switch" />' +
                '<input type="text" class="new-sn" placeholder="Nomor seri" />' +
                "</li>"
        );
    });

    // Remove node input
    $("#btn-remove-input").on("click", function () {
        var inputs = $("#new-nodelist").children("li");
        if (inputs.length > 1) {
            inputs.last().remove();
            clearValidationErrors();
        }
    });

    // Add nodes
    $("#btn-add-nodes").on("click", function () {
        try {
            if (!isDataLoaded) {
                showMessage(MESSAGES.DATA_NOT_LOADED, "error");
                return;
            }

            const validation = validateNodeInputs();
            if (!validation.isValid) {
                showMessage(MESSAGES.VALIDATION_ERROR, "error");
                return;
            }

            var $chartContainer = $("#chart-container");
            var nodeVals = [];
            var ipVals = [];
            var jenisVals = [];
            var snVals = [];

            $("#new-nodelist")
                .children("li")
                .each(function () {
                    var nodeName = $(this).find(".new-node").val().trim();
                    var ipAddr = $(this).find(".new-ip").val().trim();
                    var jenis = $(this).find(".new-jenis").val().trim();
                    var sn = $(this).find(".new-sn").val().trim();
                    nodeVals.push(nodeName);
                    ipVals.push(ipAddr);
                    jenisVals.push(jenis);
                    snVals.push(sn);
                });

            // Check for duplicates
            for (let i = 0; i < nodeVals.length; i++) {
                if (checkDuplicateName(nodeVals[i])) {
                    showMessage(`Nama switch "${nodeVals[i]}" sudah ada`, "error");
                    return;
                }
                if (checkDuplicateIP(ipVals[i])) {
                    showMessage(`IP address "${ipVals[i]}" sudah digunakan`, "error");
                    return;
                }
            }

            var nodeType = $('input[name="node-type"]:checked');
            if (!nodeType.length) {
                showMessage("Silakan pilih tipe node", "error");
                return;
            }

            var $node = $("#selected-node").data("node");
            if (nodeType.val() !== "parent") {
                if (!$("#selected-node").val() || !$node) {
                    showMessage("Silakan pilih satu node di orgchart", "error");
                    return;
                }
            }

            if (nodeType.val() !== "parent" && !$(".orgchart").length) {
                showMessage("Silakan buat root node terlebih dahulu", "error");
                return;
            }

            if (nodeType.val() === "parent") {
                if (!$chartContainer.children(".orgchart").length) {
                    datascource = {
                        id: getId(),
                        name: nodeVals[0],
                        ip: ipVals[0],
                        jenis: jenisVals[0],
                        sn: snVals[0],
                        ch: [],
                        children: [],
                    };
                    renderChart();
                } else {
                    const oldRoot = datascource;
                    datascource = {
                        id: getId(),
                        name: nodeVals[0],
                        ip: ipVals[0],
                        jenis: jenisVals[0],
                        sn: snVals[0],
                        ch: [],
                        children: [oldRoot],
                    };
                    renderChart();
                }
            } else {
                if (!$node.siblings(".nodes").length) {
                    var rel = nodeVals.length > 1 ? "110" : "100";
                    oc.addChildren(
                        $node,
                        nodeVals.map(function (item, index) {
                            return {
                                id: getId(),
                                name: item,
                                ip: ipVals[index],
                                jenis: jenisVals[index],
                                sn: snVals[index],
                                ch: [],
                                children: [],
                                relationship: rel,
                            };
                        })
                    );
                } else {
                    oc.addSiblings(
                        $node.siblings(".nodes").find(".node:first"),
                        nodeVals.map(function (item, index) {
                            return {
                                id: getId(),
                                name: item,
                                ip: ipVals[index],
                                jenis: jenisVals[index],
                                sn: snVals[index],
                                ch: [],
                                children: [],
                                relationship: "110",
                            };
                        })
                    );
                }

                var selectedName = $node.find(".title").text();
                var parentNodeObject = findNodeByName(datascource, selectedName);
                if (parentNodeObject) {
                    if (!parentNodeObject.children) parentNodeObject.children = [];
                    nodeVals.forEach((item, i) => {
                        parentNodeObject.children.push({
                            id: getId(),
                            name: item,
                            ip: ipVals[i],
                            jenis: jenisVals[i],
                            sn: snVals[i],
                            ch: [],
                            children: [],
                            relationship: "100",
                        });
                    });
                }
            }

            setTimeout(function () {
                addToggleArrows();
            }, 200);

            $("#new-nodelist").find("input").val("");
            clearValidationErrors();
            showMessage(`${nodeVals.length} ${MESSAGES.NODE_ADDED}`, "success");

            scheduleAutoSave();
        } catch (error) {
            console.error("Error adding nodes:", error);
            showMessage("Error dalam menambah node: " + error.message, "error");
        }
    });

    // Delete nodes
    $("#btn-delete-nodes").on("click", function () {
        if (!isDataLoaded) {
            showMessage(MESSAGES.DATA_NOT_LOADED, "error");
            return;
        }

        if (confirm(MESSAGES.CONFIRM_DELETE)) {
            try {
                var $node = $("#selected-node").data("node");
                if (!$node) {
                    showMessage(MESSAGES.NODE_NOT_SELECTED, "error");
                    return;
                } else if ($node[0] === $(".orgchart").find(".node:first")[0]) {
                    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh chart?")) {
                        return;
                    }
                    datascource = {};
                }

                var nodeNameToDelete = $node.find(".title").text();
                oc.removeNodes($node);

                if (datascource.name !== nodeNameToDelete) {
                    removeNodeByName(datascource, nodeNameToDelete);
                } else {
                    datascource = {};
                }

                $("#selected-node").val("").data("node", null);
                renderChart();
                clearSelection();
                showMessage(MESSAGES.NODE_DELETED, "success");

                scheduleAutoSave();
            } catch (error) {
                console.error("Error deleting node:", error);
                showMessage("Error dalam menghapus node: " + error.message, "error");
            }
        }
    });

    // Reset form
    $("#btn-reset").on("click", function () {
        clearSelection();
    });

    // Add port
    $("#ch-add-btn").on("click", function () {
        try {
            if (!isDataLoaded) {
                showMessage(MESSAGES.DATA_NOT_LOADED, "error");
                return;
            }

            var nodeName = $("#selected-node").val();
            if (!nodeName) {
                showMessage(MESSAGES.NODE_NOT_SELECTED, "error");
                return;
            }

            var nodeData = findNodeDataByName(datascource, nodeName);
            if (!nodeData) {
                showMessage("Data node yang dipilih tidak ditemukan", "error");
                return;
            }

            if (!nodeData.ch) {
                nodeData.ch = [];
            }

            if (nodeData.ch.length >= APP_CONFIG.MAX_PORTS) {
                showMessage(`Maksimal ${APP_CONFIG.MAX_PORTS} port per switch`, "error");
                return;
            }

            var maxPortNumber = 0;
            nodeData.ch.forEach(function (c) {
                var pNum = parseInt(c.port, 10);
                if (!isNaN(pNum) && pNum > maxPortNumber) maxPortNumber = pNum;
            });
            var newPortNum = (maxPortNumber + 1).toString().padStart(2, "0");

            nodeData.ch.push({
                port: newPortNum,
                segment: "",
                trunk: "N",
                status: "N",
                ip: "",
                keterangan: "",
            });

            renderChInputs(nodeData.ch, "edit", nodeData);
            showMessage(MESSAGES.PORT_ADDED, "success");

            scheduleAutoSave();
        } catch (error) {
            console.error("Error adding port:", error);
            showMessage("Error dalam menambah port: " + error.message, "error");
        }
    });

    // Update port and node info
    $("#btn-update-ch").on("click", function () {
        try {
            if (!isDataLoaded) {
                showMessage(MESSAGES.DATA_NOT_LOADED, "error");
                return;
            }

            clearValidationErrors();
            var nodeName = $("#selected-node").val();
            if (!nodeName) {
                showMessage(MESSAGES.NODE_NOT_SELECTED, "error");
                return;
            }

            var nodeData = findNodeDataByName(datascource, nodeName);
            if (!nodeData) {
                showMessage("Data node yang dipilih tidak ditemukan", "error");
                return;
            }

            var oldName = nodeData.name;
            var newName = $("#node-name").val().trim();
            var newIP = $("#node-ip").val().trim();
            var newSN = $("#node-sn").val().trim();

            // Validate new name and IP
            if (!validateSwitchName(newName)) {
                showValidationError($("#node-name"), "Format nama switch tidak valid");
                showMessage("Nama switch tidak valid", "error");
                return;
            }

            if (!validateIP(newIP)) {
                showValidationError($("#node-ip"), "Format IP address tidak valid");
                showMessage("IP address tidak valid", "error");
                return;
            }

            if (!validateSwitchName(newSN)) {
                showValidationError($("#node-sn"), "Format SN tidak valid");
                showMessage("SN switch tidak valid", "error");
                return;
            }

            // Check for duplicates (excluding current node)
            if (newName !== oldName && checkDuplicateName(newName, oldName)) {
                showValidationError($("#node-name"), "Nama switch sudah ada");
                showMessage(`Nama switch "${newName}" sudah ada`, "error");
                return;
            }

            if (newIP !== nodeData.ip && checkDuplicateIP(newIP, oldName)) {
                showValidationError($("#node-ip"), "IP address sudah digunakan");
                showMessage(`IP address "${newIP}" sudah digunakan`, "error");
                return;
            }

            if (newSN !== nodeData.sn && checkDuplicateSN(newSN, oldName)) {
                showValidationError($("#node-sn"), "SN sudah digunakan");
                showMessage(`SN "${newSN}" sudah digunakan`, "error");
                return;
            }

            nodeData.name = newName;
            nodeData.ip = newIP;
            nodeData.jenis = $("#node-jenis").val().trim();
            nodeData.sn = newSN;

            if (!nodeData.children) {
                nodeData.children = [];
            }

            var chArray = nodeData.ch;
            if (!chArray) {
                showMessage("Node yang dipilih tidak memiliki informasi port", "error");
                return;
            }

            // Validate and update port information
            var hasError = false;
            $("#ch-list li").each(function () {
                var index = $(this).find("input.ch-segment").data("index");
                if (typeof index !== "undefined" && chArray[index]) {
                    var segmentVal = $(this).find("input.ch-segment").val().trim();
                    var ipVal = $(this).find("input.ch-ip").val().trim();

                    if (segmentVal && !validateIP(segmentVal)) {
                        showValidationError($(this).find("input.ch-segment"), "Format IP segment tidak valid");
                        hasError = true;
                    }

                    if (ipVal && !validateIP(ipVal)) {
                        showValidationError($(this).find("input.ch-ip"), "Format IP port tidak valid");
                        hasError = true;
                    }

                    if (!hasError) {
                        chArray[index].segment = segmentVal;
                        chArray[index].ip = ipVal;
                        chArray[index].keterangan = $(this).find("input.ch-keterangan").val().trim();
                        chArray[index].trunk = $(this).find("input.ch-trunk").is(":checked") ? "Y" : "N";
                        chArray[index].status = $(this).find("input.ch-status").is(":checked") ? "Y" : "N";
                    }
                }
            });

            if (hasError) {
                showMessage(MESSAGES.VALIDATION_ERROR, "error");
                return;
            }

            const collapseState = getCollapseState();
            renderChart(collapseState);
            $("#selected-node").val(nodeData.name);

            showMessage(MESSAGES.INFO_UPDATED, "success");
            scheduleAutoSave();
        } catch (error) {
            console.error("Error updating port and node info:", error);
            showMessage("Error dalam memperbarui informasi: " + error.message, "error");
        }
    });

    // Port mode change
    $(document).on("change", 'input[name="ch-mode"]', function () {
        try {
            var mode = $(this).val();
            var selectedNodeName = $("#selected-node").val();
            if (selectedNodeName) {
                var nodeData = findNodeDataByName(datascource, selectedNodeName);
                if (nodeData && nodeData.ch) {
                    renderChInputs(nodeData.ch, mode, nodeData);
                    if (mode === "edit") {
                        $("#ch-add-btn").show();
                    } else {
                        $("#ch-add-btn").hide();
                    }
                }
            }
        } catch (error) {
            console.error("Error changing port mode:", error);
            showMessage("Error dalam mengubah mode port: " + error.message, "error");
        }
    });

    // Auto-save pada port input changes
    $(document).on("input change", ".ch-segment, .ch-ip, .ch-keterangan, .ch-trunk, .ch-status", function () {
        if (isDataLoaded) {
            scheduleAutoSave();
        }
    });

    // Manual refresh data dari server
    $("#btn-refresh-data").on("click", function () {
        if (confirm(MESSAGES.REFRESH_DATA)) {
            RefreshTimer.reset(); // Reset countdown
            loadSwitchData();
        }
    });

    // Export data sebagai JSON
    $("#btn-export-data").on("click", function () {
        if (!isDataLoaded) {
            showMessage(MESSAGES.DATA_NOT_LOADED, "error");
            return;
        }

        try {
            const dataStr = JSON.stringify(datascource, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `switch-data-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            showMessage(MESSAGES.EXPORT_SUCCESS, "success");
        } catch (error) {
            console.error("Export error:", error);
            showMessage("Error dalam mengekspor data", "error");
        }
    });

    // Download backup dari server
    $("#btn-download-backup").on("click", function () {
        if (!isDataLoaded) {
            showMessage(MESSAGES.DATA_NOT_LOADED, "error");
            return;
        }

        showLoading(true);

        ApiHelper.switchRequest({
            endpoint: API_CONFIG.SWITCH_API.ENDPOINTS.BACKUP,
            method: "POST",
        })
            .then((response) => {
                if (response.success && response.backup) {
                    const backupData = response.backup;
                    const dataStr = JSON.stringify(backupData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: "application/json" });
                    const url = URL.createObjectURL(dataBlob);

                    const downloadLink = document.createElement("a");
                    downloadLink.href = url;
                    downloadLink.download = `switch-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);

                    showMessage(MESSAGES.BACKUP_SUCCESS, "success");
                } else {
                    throw new Error(response.message || "Gagal mengambil backup dari server");
                }
            })
            .catch((error) => {
                ApiHelper.handleError(error, "Gagal mengunduh backup");
            })
            .finally(() => {
                showLoading(false);
            });
    });

    $("#btn-import-data").on("click", function () {
        const fileInput = $('<input type="file" accept="application/json">');
        fileInput.on("change", function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // === penting ===
                    const payload = { backup: importedData };

                    if (!payload.backup.datasource || !payload.backup.datasource.name || !payload.backup.datasource.ip) {
                        showMessage("Format file JSON tidak valid untuk restore", "error");
                        return;
                    }

                    showLoading(true);

                    ApiHelper.switchRequest({
                        endpoint: API_CONFIG.SWITCH_API.ENDPOINTS.RESTORE,
                        method: "POST",
                        data: payload,
                    })
                        .then((response) => {
                            if (response.success) {
                                datascource = payload.backup.datasource;
                                renderChart();
                                showMessage(MESSAGES.RESTORE_SUCCESS, "success");
                            } else {
                                throw new Error(response.error || "Restore gagal");
                            }
                        })
                        .catch((error) => {
                            ApiHelper.handleError(error, "Gagal mengimport data");
                        })
                        .finally(() => {
                            showLoading(false);
                        });
                } catch (err) {
                    showMessage("File JSON tidak valid: " + err.message, "error");
                }
            };
            reader.readAsText(file);
        });
        fileInput.click();
    });

    // Manual save ke server
    $("#btn-manual-save").on("click", function () {
        if (!isDataLoaded) {
            showMessage(MESSAGES.DATA_NOT_LOADED, "error");
            return;
        }

        if (confirm("Apakah Anda yakin ingin menyimpan semua data node ke server?")) {
            saveSwitchData(true);
        }
    });

    // Fungsi btn-print-pdf
    document.getElementById("btn-print-pdf").addEventListener("click", async () => {
        const chartEl = document.getElementById("chart-container");

        if (!chartEl) {
            alert("Chart container tidak ditemukan!");
            return;
        }

        // Tampilkan overlay loading
        document.getElementById("loading-overlay").style.display = "flex";

        try {
            // Simpan state scrolling asli
            const originalOverflow = document.body.style.overflow;
            const originalHeight = document.body.style.height;
            const contentWrapper = document.querySelector(".content-wrapper");
            const originalWrapperOverflow = contentWrapper ? contentWrapper.style.overflow : "";
            const originalWrapperHeight = contentWrapper ? contentWrapper.style.height : "";

            // Nonaktifkan scrolling sementara untuk capture penuh
            document.body.style.overflow = "visible";
            document.body.style.height = "auto";
            if (contentWrapper) {
                contentWrapper.style.overflow = "visible";
                contentWrapper.style.height = "auto";
            }

            // Expand semua collapsed nodes agar terlihat dalam print
            const orgChart = chartEl.querySelector(".orgchart");
            let collapsedNodes = [];
            if (orgChart) {
                // Simpan state collapsed nodes
                const hiddenNodes = orgChart.querySelectorAll(".node.collapsed, .hierarchy.isChildrenCollapsed, .hierarchy.isCollapsedDescendant");
                hiddenNodes.forEach((node) => {
                    collapsedNodes.push({
                        element: node,
                        classes: Array.from(node.classList),
                    });
                    // Temporarily show all nodes
                    node.classList.remove("collapsed", "isChildrenCollapsed", "isCollapsedDescendant", "isCollapsedSibling", "isSiblingsCollapsed");
                    node.style.display = "";
                });

                // Show all hidden elements
                const hiddenElements = orgChart.querySelectorAll('[style*="display: none"], .hidden');
                hiddenElements.forEach((el) => {
                    if (el.style.display === "none") {
                        el.style.display = "";
                    }
                    if (el.classList.contains("hidden")) {
                        el.classList.remove("hidden");
                        el.setAttribute("data-was-hidden", "true");
                    }
                });
            }

            // Tunggu sebentar agar layout ter-update
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Dapatkan dimensi penuh dari chart container
            const chartRect = chartEl.getBoundingClientRect();
            const fullWidth = chartEl.scrollWidth;
            const fullHeight = chartEl.scrollHeight;

            console.log(`Chart dimensions: ${fullWidth}x${fullHeight}`);

            // Render chart ke canvas dengan opsi untuk menangkap konten penuh
            const canvas = await html2canvas(chartEl, {
                scale: 1.5, // Turunkan scale untuk performa lebih baik
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
                width: fullWidth,
                height: fullHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: fullWidth,
                windowHeight: fullHeight,
                onclone: function (clonedDoc) {
                    // Pastikan cloned document menampilkan semua konten
                    const clonedChart = clonedDoc.getElementById("chart-container");
                    if (clonedChart) {
                        clonedChart.style.overflow = "visible";
                        clonedChart.style.height = "auto";
                        clonedChart.style.width = "auto";
                    }

                    const clonedBody = clonedDoc.body;
                    clonedBody.style.overflow = "visible";
                    clonedBody.style.height = "auto";

                    const clonedWrapper = clonedDoc.querySelector(".content-wrapper");
                    if (clonedWrapper) {
                        clonedWrapper.style.overflow = "visible";
                        clonedWrapper.style.height = "auto";
                    }
                },
            });

            // Restore collapsed state
            collapsedNodes.forEach((nodeData) => {
                nodeData.element.className = "";
                nodeData.classes.forEach((cls) => nodeData.element.classList.add(cls));
            });

            // Restore hidden elements
            if (orgChart) {
                const elementsToHide = orgChart.querySelectorAll('[data-was-hidden="true"]');
                elementsToHide.forEach((el) => {
                    el.classList.add("hidden");
                    el.removeAttribute("data-was-hidden");
                });
            }

            // Restore original styles
            document.body.style.overflow = originalOverflow;
            document.body.style.height = originalHeight;
            if (contentWrapper) {
                contentWrapper.style.overflow = originalWrapperOverflow;
                contentWrapper.style.height = originalWrapperHeight;
            }

            const imgData = canvas.toDataURL("image/png");

            // Buat PDF
            const { jsPDF } = window.jspdf;

            // Tentukan orientasi berdasarkan aspek rasio
            const aspectRatio = canvas.width / canvas.height;
            const orientation = aspectRatio > 1.2 ? "landscape" : "portrait";

            const pdf = new jsPDF(orientation, "pt", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Tambahkan header
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Topology Network Manager", pageWidth / 2, 25, { align: "center" });

            // Hitung ukuran gambar yang optimal
            const headerSpace = 40;
            const footerSpace = 30;
            const availableHeight = pageHeight - headerSpace - footerSpace;
            const availableWidth = pageWidth - 40; // margin 20 di kiri kanan

            // Hitung scale untuk fit ke page
            const scaleX = availableWidth / canvas.width;
            const scaleY = availableHeight / canvas.height;
            const scale = Math.min(scaleX, scaleY, 1); // Maksimal 100% scale

            const finalWidth = canvas.width * scale;
            const finalHeight = canvas.height * scale;
            const xOffset = (pageWidth - finalWidth) / 2;
            const yOffset = headerSpace;

            // Jika masih tidak muat dalam satu halaman, buat multiple pages
            if (finalHeight > availableHeight) {
                // Split image menjadi beberapa bagian
                const pagesNeeded = Math.ceil(finalHeight / availableHeight);
                const sectionHeight = canvas.height / pagesNeeded;

                for (let i = 0; i < pagesNeeded; i++) {
                    if (i > 0) {
                        pdf.addPage();
                        // Header untuk halaman selanjutnya
                        pdf.setFontSize(14);
                        pdf.setFont("helvetica", "bold");
                        pdf.text(`Topology Network Manager (${i + 1}/${pagesNeeded})`, pageWidth / 2, 25, { align: "center" });
                    }

                    // Crop bagian gambar untuk halaman ini
                    const cropCanvas = document.createElement("canvas");
                    const cropCtx = cropCanvas.getContext("2d");
                    cropCanvas.width = canvas.width;
                    cropCanvas.height = sectionHeight;

                    cropCtx.drawImage(canvas, 0, -i * sectionHeight);
                    const sectionImgData = cropCanvas.toDataURL("image/png");

                    const sectionFinalHeight = sectionHeight * scale;
                    pdf.addImage(sectionImgData, "PNG", xOffset, yOffset, finalWidth, sectionFinalHeight);
                }
            } else {
                // Gambar muat dalam satu halaman
                pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);
            }

            // Tambahkan footer di halaman terakhir
            const now = new Date();
            const dateStr = now.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
            const footerText = `© 2024 Developed by Purwanto Ridwan | Printed: ${dateStr}`;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(footerText, pageWidth / 2, pageHeight - 15, { align: "center" });

            // Preview di tab baru
            const pdfBlobUrl = pdf.output("bloburl");
            window.open(pdfBlobUrl, "_blank");

            console.log("PDF berhasil dibuat dengan ukuran chart:", finalWidth, "x", finalHeight);
        } catch (err) {
            console.error("Gagal membuat PDF:", err);
            alert("Gagal mencetak PDF: " + err.message + ". Lihat console untuk detail.");
        } finally {
            document.getElementById("loading-overlay").style.display = "none";
        }
    });

    // User menu toggle
    $("#user-name").on("click", function () {
        $("#logout-menu").toggle();
    });

    // Logout action
    $("#btn-logout").on("click", function () {
        if (confirm(MESSAGES.CONFIRM_LOGOUT)) {
            StorageHelper.clearAuth();
            window.location.href = "login.html";
        }
    });
});
