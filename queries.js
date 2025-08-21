const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.17.0.5',
  database: 'postgres',
  password: 'password',
  port: 5432,
})
const getInbox = (request, response) => {
    pool.query('SELECT pan, tn, statustype, cdate, cby, cid FROM public.itba', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};


const viewInbox = (request, response) => {
  const cid = parseInt(request.params.cid)

  pool.query('SELECT pan, tn, statustype, cdate, cby, cid FROM public.itba WHERE cid = $1', [cid], (error, results) => {
    if (error) {
      console.error('Error executing query', error.stack)
      response.status(500).json({ error: 'Internal Server Error' })
      return
    }
    response.status(200).json(results.rows)
  })
}



const viewDocByCidAndPan = (request, response) => {
  const { cid, pan } = request.body;

  pool.query(
    'SELECT doc, cid FROM public.itba WHERE cid = $1 AND pan = $2',
    [cid, pan],
    (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.rows.length === 0) {
        response.status(404).json({ error: 'No entry found with the provided CID and PAN' });
        return;
      }
      response.status(200).json(results.rows[0]);
    }
  );
};




const saveInbox = (request, response) => {
  const { cid, pan, tn, statustype, cdate, cby, doc } = request.body;

  pool.query(
    'INSERT INTO public.itba (cid, pan, tn, statustype, cdate, cby, doc) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [cid, pan, tn, statustype, cdate, cby, doc],
    (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      response.status(201).send(`Inbox entry added with CID: ${cid}`);
    }
  );
};


const updateDoc = (request, response) => {
  const { cid, doc } = request.body; 

  pool.query(
    'UPDATE public.itba SET doc = $1 WHERE cid = $2',
    [doc, cid],
    (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      response.status(200).send(`Inbox entry modified with CID: ${cid}`);
    }
  );
};


const deleteInbox = (request, response) => {
  const { cid } = request.body; 

  if (!cid) {
    response.status(400).json({ error: 'CID parameter is required' });
    return;
  }

  pool.query('DELETE FROM public.itba WHERE cid = $1', [cid], (error, results) => {
    if (error) {
      console.error('Error executing query', error.stack);
      response.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    if (results.rowCount === 0) {
      response.status(404).json({ error: `No inbox entry found with CID: ${cid}` });
    } else {
      response.status(200).json({ cid: cid, message: `Inbox entry deleted with CID: ${cid}` });
    }
  });
};





const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM test WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}




module.exports = {
  getInbox,
  viewInbox,
  viewDocByCidAndPan,
  saveInbox,
  updateDoc,
  deleteInbox,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

