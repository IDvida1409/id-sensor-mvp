function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function buildHealthSummary(devices) {
  const total = devices.length;
  const calibrated = devices.filter((d) => d.calibrationStatus === 'calibrated').length;
  const nearDue = devices.filter((d) => d.calibrationStatus === 'near_due').length;
  const expired = devices.filter((d) => d.calibrationStatus === 'expired').length;
  const maintenance = devices.filter((d) => d.state === 'maint').length;
  const communicating = devices.filter((d) => d.online !== false).length;
  const noCommunication = devices.filter((d) => d.online === false).length;

  return {
    total,
    healthyPercent: percent(calibrated, Math.max(total, 1)),
    metrics: {
      calibrated,
      nearDue,
      expired,
      maintenance,
      communicating,
      noCommunication
    }
  };
}

function buildContractSummary(devices) {
  const total = devices.length;
  const inContract = devices.filter((d) => !!d.inContract).length;
  const pending = devices.filter((d) => !!d.pendingActivation).length;
  const available = devices.filter((d) => !d.linkedEquipmentId).length;

  return {
    total,
    inContract,
    pending,
    available
  };
}

function buildOperationalStatus(devices) {
  const total = devices.length;
  const counts = {
    outOfRange: devices.filter((d) => d.state === 'crit').length,
    maintenance: devices.filter((d) => d.state === 'maint').length,
    available: devices.filter((d) => !d.linkedEquipmentId).length,
    inUse: devices.filter((d) => d.online === true).length,
    inventory: devices.filter((d) => d.state === 'inventory').length,
    defrost: devices.filter((d) => d.state === 'defrost').length,
    restock: devices.filter((d) => d.state === 'restock').length
  };

  return {
    total,
    counts,
    percents: {
      outOfRange: percent(counts.outOfRange, total),
      maintenance: percent(counts.maintenance, total),
      available: percent(counts.available, total),
      inUse: percent(counts.inUse, total),
      inventory: percent(counts.inventory, total),
      defrost: percent(counts.defrost, total),
      restock: percent(counts.restock, total)
    }
  };
}

function groupDevicesByArea(devices) {
  const map = new Map();
  devices.forEach((device) => {
    const key = device.areaId;
    if (!map.has(key)) {
      map.set(key, {
        areaId: device.areaId,
        areaName: device.areaName,
        devices: []
      });
    }
    map.get(key).devices.push(device);
  });
  return Array.from(map.values());
}

function buildDrillTree(type, devices) {
  const byArea = groupDevicesByArea(devices);

  if (type === 'contracts') {
    return byArea.map((group) => ({
      id: group.areaId,
      title: group.areaName,
      total: group.devices.length,
      inContract: group.devices.filter((d) => d.inContract).length,
      pending: group.devices.filter((d) => d.pendingActivation).length,
      available: group.devices.filter((d) => !d.linkedEquipmentId).length,
      devices: group.devices.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        linkedEquipmentId: d.linkedEquipmentId
      }))
    }));
  }

  if (type === 'health') {
    return byArea.map((group) => ({
      id: group.areaId,
      title: group.areaName,
      total: group.devices.length,
      calibrated: group.devices.filter((d) => d.calibrationStatus === 'calibrated').length,
      nearDue: group.devices.filter((d) => d.calibrationStatus === 'near_due').length,
      expired: group.devices.filter((d) => d.calibrationStatus === 'expired').length,
      communicationIssues: group.devices.filter((d) => d.online === false).length
    }));
  }

  return byArea.map((group) => ({
    id: group.areaId,
    title: group.areaName,
    total: group.devices.length,
    outOfRange: group.devices.filter((d) => d.state === 'crit').length,
    nearLimit: group.devices.filter((d) => d.state === 'warn').length,
    maintenance: group.devices.filter((d) => d.state === 'maint').length,
    inventory: group.devices.filter((d) => d.state === 'inventory').length,
    defrost: group.devices.filter((d) => d.state === 'defrost').length,
    restock: group.devices.filter((d) => d.state === 'restock').length
  }));
}

module.exports = {
  buildHealthSummary,
  buildContractSummary,
  buildOperationalStatus,
  buildDrillTree
};
