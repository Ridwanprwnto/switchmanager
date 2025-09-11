$(function () {
    var datascource = {
        name: "SW-RUANG-SERVER",
        ip: "192.168.0.1",
        ch: [
            { port: "01", segment: "192.168.0.1", trunk: "N", status: "N", ip: "192.168.0.101", keterangan: "Port 01 uplink" },
            { port: "02", segment: "192.168.0.2", trunk: "N", status: "N", ip: "192.168.0.102", keterangan: "Port 02 printer" },
            { port: "03", segment: "192.168.0.3", trunk: "N", status: "N", ip: "192.168.0.103", keterangan: "Port 03 office PC" },
            { port: "04", segment: "192.168.0.4", trunk: "N", status: "N", ip: "192.168.0.104", keterangan: "Port 04 admin PC" },
            { port: "05", segment: "192.168.0.5", trunk: "N", status: "N", ip: "192.168.0.105", keterangan: "Port 05 WiFi AP" },
            { port: "06", segment: "192.168.0.6", trunk: "N", status: "N", ip: "192.168.0.106", keterangan: "Port 06 IP Phone" },
            { port: "07", segment: "192.168.0.7", trunk: "N", status: "N", ip: "192.168.0.107", keterangan: "Port 07 conference room" },
            { port: "08", segment: "192.168.0.8", trunk: "N", status: "N", ip: "192.168.0.108", keterangan: "Port 08 security cam" },
            { port: "09", segment: "192.168.0.9", trunk: "N", status: "N", ip: "192.168.0.109", keterangan: "Port 09 guest network" },
            { port: "10", segment: "192.168.0.10", trunk: "Y", status: "N", ip: "192.168.0.110", keterangan: "Port 10 trunk to core" },
        ],
        children: [
            {
                name: "SW-GATE-RCV",
                ip: "192.168.0.2",
                ch: [
                    { port: "01", segment: "192.168.0.1", trunk: "N", status: "N", ip: "192.168.0.201", keterangan: "Gate port 01" },
                    { port: "02", segment: "192.168.0.2", trunk: "N", status: "N", ip: "192.168.0.202", keterangan: "Gate port 02" },
                    { port: "03", segment: "192.168.0.3", trunk: "N", status: "N", ip: "192.168.0.203", keterangan: "Gate port 03" },
                    { port: "04", segment: "192.168.0.4", trunk: "N", status: "N", ip: "192.168.0.204", keterangan: "Gate port 04" },
                    { port: "05", segment: "192.168.0.5", trunk: "N", status: "N", ip: "192.168.0.205", keterangan: "Gate port 05" },
                    { port: "06", segment: "192.168.0.6", trunk: "N", status: "N", ip: "192.168.0.206", keterangan: "Gate port 06" },
                    { port: "07", segment: "192.168.0.7", trunk: "N", status: "N", ip: "192.168.0.207", keterangan: "Gate port 07" },
                    { port: "08", segment: "192.168.0.8", trunk: "N", status: "N", ip: "192.168.0.208", keterangan: "Gate port 08" },
                    { port: "09", segment: "192.168.0.9", trunk: "N", status: "N", ip: "192.168.0.209", keterangan: "Gate port 09" },
                    { port: "10", segment: "192.168.0.10", trunk: "Y", status: "N", ip: "192.168.0.210", keterangan: "Gate trunk port 10" },
                ],
            },
            {
                name: "SW-RUANG-ADMIN",
                ip: "192.168.0.3",
                ch: [
                    { port: "01", segment: "192.168.0.1", trunk: "N", status: "N", ip: "192.168.0.301", keterangan: "Admin port 01" },
                    { port: "02", segment: "192.168.0.2", trunk: "N", status: "N", ip: "192.168.0.302", keterangan: "Admin port 02" },
                    { port: "03", segment: "192.168.0.3", trunk: "N", status: "N", ip: "192.168.0.303", keterangan: "Admin port 03" },
                    { port: "04", segment: "192.168.0.4", trunk: "N", status: "N", ip: "192.168.0.304", keterangan: "Admin port 04" },
                    { port: "05", segment: "192.168.0.5", trunk: "N", status: "N", ip: "192.168.0.305", keterangan: "Admin port 05" },
                    { port: "06", segment: "192.168.0.6", trunk: "N", status: "N", ip: "192.168.0.306", keterangan: "Admin port 06" },
                    { port: "07", segment: "192.168.0.7", trunk: "N", status: "N", ip: "192.168.0.307", keterangan: "Admin port 07" },
                    { port: "08", segment: "192.168.0.8", trunk: "N", status: "N", ip: "192.168.0.308", keterangan: "Admin port 08" },
                    { port: "09", segment: "192.168.0.9", trunk: "N", status: "N", ip: "192.168.0.309", keterangan: "Admin port 09" },
                    { port: "10", segment: "192.168.0.10", trunk: "Y", status: "N", ip: "192.168.0.310", keterangan: "Admin trunk port 10" },
                ],
            },
            {
                name: "SW-CCTV",
                ip: "192.168.0.4",
                ch: [
                    { port: "01", segment: "192.168.0.1", trunk: "N", status: "N", ip: "192.168.0.401", keterangan: "CCTV port 01" },
                    { port: "02", segment: "192.168.0.2", trunk: "N", status: "N", ip: "192.168.0.402", keterangan: "CCTV port 02" },
                    { port: "03", segment: "192.168.0.3", trunk: "N", status: "N", ip: "192.168.0.403", keterangan: "CCTV port 03" },
                    { port: "04", segment: "192.168.0.4", trunk: "N", status: "N", ip: "192.168.0.404", keterangan: "CCTV port 04" },
                    { port: "05", segment: "192.168.0.5", trunk: "N", status: "N", ip: "192.168.0.405", keterangan: "CCTV port 05" },
                    { port: "06", segment: "192.168.0.6", trunk: "N", status: "N", ip: "192.168.0.406", keterangan: "CCTV port 06" },
                    { port: "07", segment: "192.168.0.7", trunk: "N", status: "N", ip: "192.168.0.407", keterangan: "CCTV port 07" },
                    { port: "08", segment: "192.168.0.8", trunk: "N", status: "N", ip: "192.168.0.408", keterangan: "CCTV port 08" },
                    { port: "09", segment: "192.168.0.9", trunk: "N", status: "N", ip: "192.168.0.409", keterangan: "CCTV port 09" },
                    { port: "10", segment: "192.168.0.10", trunk: "Y", status: "N", ip: "192.168.0.410", keterangan: "CCTV trunk port 10" },
                ],
            },
        ],
    };

    var getId = function () {
        return new Date().getTime() * 1000 + Math.floor(Math.random() * 1001);
    };
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

    function renderChart() {
        if (oc) {
            oc.$chartContainer.empty();
        }
        oc = $("#chart-container").orgchart({
            data: datascource,
            createNode: function ($node, data) {
                $node[0].id = getId();
                var ipText = data.ip ? data.ip : "IP not set";
                var ipView = $('<div class="ip-address-view"></div>').text(ipText);
                $node.append(ipView);
            },
        });
        oc.$chartContainer.on("click", ".node", function () {
            var $this = $(this);
            var nodeName = $this.find(".title").text();
            $("#selected-node").val(nodeName).data("node", $this);
            var nodeData = findNodeDataByName(datascource, nodeName);
            if (nodeData && nodeData.ch) {
                renderChInputs(nodeData.ch, $('input[name="ch-mode"]:checked').val(), nodeData);
                $("#ch-container").show();
            } else {
                $("#ch-container").hide();
                $("#ch-list").empty();
            }
        });
        oc.$chartContainer.on("click", ".orgchart", function (event) {
            if (!$(event.target).closest(".node").length) {
                $("#selected-node").val("").data("node", null);
                $("#ch-container").hide();
                $("#ch-list").empty();
            }
        });
    }

    function renderChInputs(chArray, mode, node) {
        var $list = $("#ch-list");
        $list.empty();
        if (node) {
            $("#node-name").val(node.name);
            $("#node-ip").val(node.ip || "");
            if (mode === "edit") {
                $("#node-name, #node-ip").prop("readonly", false);
            } else {
                $("#node-name, #node-ip").prop("readonly", true);
            }
        }
        chArray.forEach(function (portObj, index) {
            var $li = $("<li></li>");
            var $portLabel = $("<label></label>").text("Port:");
            var $portInput = $('<input type="text" readonly>').val(portObj.port);
            var $segLabel = $("<label></label>").text("Segment:");
            var $segInput = $('<input type="text" class="ch-segment" data-index="' + index + '">').val(portObj.segment);
            if (mode !== "edit") $segInput.prop("readonly", true);
            var $ipLabel = $("<label></label>").text("IP:");
            var $ipInput = $('<input type="text" class="ch-ip" data-index="' + index + '">').val(portObj.ip);
            if (mode !== "edit") $ipInput.prop("readonly", true);
            var $ketLabel = $("<label></label>").text("Keterangan:");
            var $ketInput = $('<input type="text" class="ch-keterangan" data-index="' + index + '">').val(portObj.keterangan);
            if (mode !== "edit") $ketInput.prop("readonly", true);
            var $trunkLabel = $("<label></label>").text("Trunk:");
            var $trunkInput;
            if (mode === "edit") {
                $trunkInput = $('<select class="ch-trunk" data-index="' + index + '">')
                    .append('<option value="Y">Y</option>')
                    .append('<option value="N">N</option>')
                    .val(portObj.trunk);
            } else {
                $trunkInput = $('<input type="text" readonly>').val(portObj.trunk);
            }
            var $statusLabel = $("<label></label>").text("Status:");
            var $statusInput;
            if (mode === "edit") {
                $statusInput = $('<select class="ch-status" data-index="' + index + '">')
                    .append('<option value="Y">Y</option>')
                    .append('<option value="N">N</option>')
                    .val(portObj.status || "N");
            } else {
                $statusInput = $('<input type="text" readonly>').val(portObj.status || "");
            }
            $li.append($portLabel, $portInput, $segLabel, $segInput, $ipLabel, $ipInput, $ketLabel, $ketInput, $trunkLabel, $trunkInput, $statusLabel, $statusInput);
            $list.append($li);
        });
        if (mode === "edit") {
            $("#btn-update-ch").show();
        } else {
            $("#btn-update-ch").hide();
        }
    }

    $("#btn-update-ch").on("click", function () {
        var nodeName = $("#selected-node").val();
        if (!nodeName) {
            alert("No node selected");
            return;
        }
        var nodeData = findNodeDataByName(datascource, nodeName);
        if (!nodeData) {
            alert("Selected node data not found");
            return;
        }
        // Update node name and ip from inputs
        nodeData.name = $("#node-name").val().trim();
        nodeData.ip = $("#node-ip").val().trim();
        var chArray = nodeData.ch;
        if (!chArray) {
            alert("Selected node has no port information");
            return;
        }
        $("#ch-list li").each(function () {
            var index = $(this).find("input.ch-segment").data("index");
            if (typeof index !== "undefined" && chArray[index]) {
                chArray[index].segment = $(this).find("input.ch-segment").val().trim();
                chArray[index].ip = $(this).find("input.ch-ip").val().trim();
                chArray[index].keterangan = $(this).find("input.ch-keterangan").val().trim();
                chArray[index].trunk = $(this).find("select.ch-trunk").val() || $(this).find("input.ch-trunk").val();
                chArray[index].status = $(this).find("select.ch-status").val() || $(this).find("input.ch-status").val();
            }
        });
        alert("Port and node information updated successfully.");
    });

    // Listen on port info mode change to rerender inputs accordingly
    $(document).on("change", 'input[name="ch-mode"]', function () {
        var mode = $(this).val();
        var selectedNodeName = $("#selected-node").val();
        if (selectedNodeName) {
            var nodeData = findNodeDataByName(datascource, selectedNodeName);
            if (nodeData && nodeData.ch) {
                renderChInputs(nodeData.ch, mode, nodeData);
            }
        }
    });
    $("#btn-reset").on("click", function () {
        $(".orgchart").find(".focused").removeClass("focused");
        $("#selected-node").val("").data("node", null);
        $("#new-nodelist").find("input").val("");
        $("#node-type-panel").find("input").prop("checked", false);
        $("#new-nodelist").children("li:not(:first)").remove();
        $("#ch-container").hide();
        $("#ch-list").empty();
    });

    renderChart();

    $(document).on("input", ".new-node, .new-ip", function () {
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(start, end);
    });
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

    $('input[name="node-type"]').on("click", function () {
        var $this = $(this);
        if ($this.val() === "parent") {
            $("#edit-panel").addClass("edit-parent-node");
            $("#new-nodelist").children(":gt(0)").remove();
        } else {
            $("#edit-panel").removeClass("edit-parent-node");
        }
    });

    $("#btn-add-input").on("click", function () {
        $("#new-nodelist").append('<li><input type="text" class="new-node" placeholder="Node name" /><input type="text" class="new-ip" placeholder="IP address" /></li>');
    });
    $("#btn-remove-input").on("click", function () {
        var inputs = $("#new-nodelist").children("li");
        if (inputs.length > 1) {
            inputs.last().remove();
        }
    });

    $("#btn-add-nodes").on("click", function () {
        var $chartContainer = $("#chart-container");
        var nodeVals = [];
        var ipVals = [];
        var abortAdd = false;
        $("#new-nodelist")
            .children("li")
            .each(function () {
                var nodeName = $(this).find(".new-node").val().trim();
                var ipAddr = $(this).find(".new-ip").val().trim();
                if (!nodeName || !ipAddr) {
                    alert("New node cannot be empty.");
                    abortAdd = true;
                    return false;
                }
                nodeVals.push(nodeName);
                ipVals.push(ipAddr);
            });
        if (abortAdd) return;
        if (nodeVals.length === 0) {
            alert("Please input value for new node");
            return;
        }
        var nodeType = $('input[name="node-type"]:checked');
        if (!nodeType.length) {
            alert("Please select a node type");
            return;
        }
        var $node = $("#selected-node").data("node");
        if (nodeType.val() !== "parent") {
            if (!$("#selected-node").val() || !$node) {
                alert("Please select one node in orgchart");
                return;
            }
        }
        if (nodeType.val() !== "parent" && !$(".orgchart").length) {
            alert("Please create the root node firstly when you want to build up the orgchart from the scratch");
            return;
        }
        if (nodeType.val() === "parent") {
            if (!$chartContainer.children(".orgchart").length) {
                datascource = {
                    name: nodeVals[0],
                    ip: ipVals[0],
                    children: [],
                };
                renderChart();
            } else {
                oc.addParent($chartContainer.find(".node:first"), {
                    name: nodeVals[0],
                    ip: ipVals[0],
                    id: getId(),
                });
                datascource.name = nodeVals[0];
                datascource.ip = ipVals[0];
            }
        } else if (nodeType.val() === "siblings") {
            if ($node[0].id === oc.$chart.find(".node:first")[0].id) {
                alert("You are not allowed to directly add sibling nodes to root node");
                return;
            }
            oc.addSiblings(
                $node,
                nodeVals.map(function (item, index) {
                    return { name: item, relationship: "110", ip: ipVals[index], id: getId() };
                })
            );
            var parentName = $("#selected-node").val();
            function findNodeByName(node, name) {
                if (node.name === name) return node;
                if (!node.children) return null;
                for (var c of node.children) {
                    var found = findNodeByName(c, name);
                    if (found) return found;
                }
                return null;
            }
            var parentNodeObject = findNodeByName(datascource, parentName);
            if (parentNodeObject && parentNodeObject.children) {
                nodeVals.forEach((item, i) => {
                    parentNodeObject.children.push({ name: item, ip: ipVals[i] });
                });
            }
        } else {
            if (!$node.siblings(".nodes").length) {
                var rel = nodeVals.length > 1 ? "110" : "100";
                oc.addChildren(
                    $node,
                    nodeVals.map(function (item, index) {
                        return { name: item, relationship: rel, ip: ipVals[index], id: getId() };
                    })
                );
            } else {
                oc.addSiblings(
                    $node.siblings(".nodes").find(".node:first"),
                    nodeVals.map(function (item, index) {
                        return { name: item, relationship: "110", ip: ipVals[index], id: getId() };
                    })
                );
            }
            var selectedName = $node.find(".title").text();
            function findNodeByName(node, name) {
                if (node.name === name) return node;
                if (!node.children) return null;
                for (var c of node.children) {
                    var found = findNodeByName(c, name);
                    if (found) return found;
                }
                return null;
            }
            var parentNodeObject = findNodeByName(datascource, selectedName);
            if (parentNodeObject) {
                if (!parentNodeObject.children) parentNodeObject.children = [];
                nodeVals.forEach((item, i) => {
                    parentNodeObject.children.push({ name: item, ip: ipVals[i] });
                });
            }
        }
        $("#new-nodelist").find("input").val("");
    });

    $("#btn-delete-nodes").on("click", function () {
        var $node = $("#selected-node").data("node");
        if (!$node) {
            alert("Please select one node in orgchart");
            return;
        } else if ($node[0] === $(".orgchart").find(".node:first")[0]) {
            if (!window.confirm("Are you sure you want to delete the whole chart?")) {
                return;
            }
            datascource = {};
        }
        oc.removeNodes($node);
        var nodeNameToDelete = $node.find(".title").text();
        function removeNodeByName(node, name) {
            if (!node.children) return;
            node.children = node.children.filter((c) => c.name !== name);
            node.children.forEach((c) => removeNodeByName(c, name));
        }
        if (datascource.name !== nodeNameToDelete) {
            removeNodeByName(datascource, nodeNameToDelete);
        } else {
            datascource = {};
        }
        $("#selected-node").val("").data("node", null);
    });

    $("#btn-reset").on("click", function () {
        $(".orgchart").find(".focused").removeClass("focused");
        $("#selected-node").val("").data("node", null);
        $("#new-nodelist").find("input").val("");
        $("#node-type-panel").find("input").prop("checked", false);
        $("#new-nodelist").children("li:not(:first)").remove();
        $("#ch-container").hide();
        $("#ch-list").empty();
    });
});
