import Organization from'../model/organization';

export const createOrganization = async (req, res) => {
  const { name, category, price, imgURL } = req.body;

  try{
    const newOrganization = new Organization({ name, category, price, imgURL });

    const organizationSaved = await newOrganization.save();

    res.status(201).json(organizationSaved);
  }catch(error){
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getOrgById = async (req, res) => {
  const { organizationId } = req.params;

  const organization = await Organization.findById(organizationId);
  res.status(200).json(organization);
};

export const getOrgs = async (req, res) => {
  const organizations = await Organization.find();
  return res.json(organizations);
};

export const updateOrgId = async (req, res) => {
  const updatedOrganization = await Organization.findByIdAndUpdate(
    req.params.organisationId,
    req.body,
    {
      new: true
    }
  );
  res.status(204).json(updatedOrganization);
};

export const deleteOrgById = async (req, res) => {
  const { organisationId } = req.params;

  await Organization.findByIdAndDelete(organisationId);

  // code 200 is ok too
  res.status(204).json();
};
