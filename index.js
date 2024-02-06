import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ data: "hello world!" });
});

// ==============================user==================================

app.post("/create-user", async (req, res) => {
  const { email, name, phone, is_active, role_id } = req.body;

  const createUser = await prisma.user.create({
    data: {
      email,
      name,
      phone,
      is_active,
      role_id,
    },
  });

  res.json({ user: createUser });
});

app.get("/get-user", async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    if (user_id) {
      const getUser = await prisma.user.findFirst({
        where: {
          user_id,
        },
      });

      return res.status(200).json({ user: getUser });
    }

    if (role_id) {
      const getUser = await prisma.user.findFirst({
        where: {
          role_id,
        },
      });

      return res.status(200).json({ user: getUser });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/update-role-user", async (req, res) => {
  const { user_id, role_id } = req.body;

  if (!user_id || !role_id) {
    return res.status(400).json("Bad Request!");
  }

  const updateRoleUser = await prisma.user.update({
    where: {
      user_id,
    },
    data: {
      role_id,
    },
  });

  return res.status(200).json({ user: updateRoleUser });
});

//==========================================roles=========================================
app.post("/create-role", async (req, res) => {
  try {
    const { title, description } = req.body;

    const createdRole = await prisma.role.create({
      data: {
        title,
        description,
      },
    });

    res.status(200).json({ role: createdRole });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.put("/update-role", async (req, res) => {
  try {
    const { role_id, title, description } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: "Role ID not found!" });
    }

    if (!title) {
      const updatedRole = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          description,
        },
      });

      return res.status(200).json({ role: updatedRole });
    }

    if (!description) {
      const updatedRole = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          title,
        },
      });

      return res.status(200).json({ role: updatedRole });
    }

    if (title && description) {
      const updatedRole = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          title,
          description,
        },
      });

      return res.status(200).json({ role: updatedRole });
    }

    return res.end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/role-delete", async (req, res) => {
  try {
    const { role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: "Role ID not found!" });
    }

    const deletedRole = await prisma.role.delete({
      where: {
        role_id,
      },
    });

    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found!" });
    }

    const map = await prisma.role_Resource_Mapping.deleteMany({
      where: {
        roleId: role_id,
      },
    });

    return res.status(200).json({ role: deletedRole });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==============================resource==================================

app.post("/create-resource", async (req, res) => {
  try {
    const { resource_type, resouce_name } = req.body;

    if (!resouce_name) {
      return res.status(400).json({ error: "Resouce Name is required!" });
    }

    if (!resource_type) {
      return res.status(400).json({ error: "Resouce Type is required!" });
    }

    const createdResource = await prisma.resource.create({
      data: {
        resource_type,
        resouce_name,
      },
    });

    return res.status(200).json({ resource: createdResource });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

app.put("/update-resource", async (req, res) => {
  try {
    const { resource_id, resouce_name, resource_type } = req.body;

    if (!resource_id) {
      return res.status(400).json({ error: "Role ID not found!" });
    }

    if (!resouce_name) {
      const updatedResource = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          resource_type,
        },
      });

      return res.status(200).json({ role: updatedResource });
    }

    if (!resource_type) {
      const updatedResource = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          resouce_name,
        },
      });

      return res.status(200).json({ role: updatedResource });
    }

    if (resouce_name && resource_type) {
      const updatedResource = await prisma.role.update({
        where: {
          role_id,
        },
        data: {
          resouce_name,
          resource_type,
        },
      });

      return res.status(200).json({ role: updatedResource });
    }

    return res.end();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/resource-delete", async (req, res) => {
  try {
    const { resource_id } = req.body;

    if (!resource_id) {
      return res.status(400).json({ error: "Role ID not found!" });
    }

    const deletedResource = await prisma.role.delete({
      where: {
        resource_id,
      },
    });

    if (!deletedResource) {
      return res.status(404).json({ error: "Resource not found!" });
    }

    const map = await prisma.role_Resource_Mapping.deleteMany({
      where: {
        resourceId: resource_id,
      },
    });

    return res.status(200).json({ role: deletedResource });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ========================role_resource_map==========================

app.post("/map", async (req, res) => {
  const { resourceId, roleId, permission } = req.body;

  if (!resourceId || !roleId || !permission) {
    return res.status(400).json({ error: "Bad request!" });
  }

  const createdMap = await prisma.role_Resource_Mapping.create({
    data: {
      roleId,
      resourceId,
      permission,
    },
  });

  return res.status(200).json({ data: createdMap });
});

app.patch("/map-permission", async (req, res) => {
  const { mapId, permission } = req.body;

  if (!mapId) {
    return res.status(400).json({ error: "Missing Role-Resource-Map Id" });
  }

  if (!permission) {
    return res.status(400).json({ error: "Permission is required!" });
  }

  const updateMap = await prisma.role_Resource_Mapping.update({
    where: {
      role_resource_id: mapId,
    },
    data: {
      permission,
    },
  });
});

// ===========================user_auth==============================
// (I dont see any password field in the users section), If I were to do this I would  create the jwt token using npm package , and after adding middleware , the required apis need to have those auth token in there headers)

app.listen(3000);
