import unittest
import json
import logging
from server import app

# Configure logging
logging.basicConfig(level=logging.INFO, handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)


class UserAPITestCase(unittest.TestCase):
    def setUp(self):
        """
        Set up the test client and enable testing mode.
        This method is called before each test.
        """
        self.app = app.test_client()
        self.app.testing = True
        logger.info("Setting up the test client")

    def tearDown(self):
        """
        Reset the in-memory storage after each test.
        This method is called after each test.
        """
        global users, next_id
        users = []
        next_id = 1
        logger.info(
            "Tearing down the test client and resetting in-memory storage")

    def test_get_all_users(self):
        """
        Test the GET /users endpoint.
        """
        logger.info("Testing GET /users")
        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), [])
        logger.info("GET /users passed")

    def test_add_user(self):
        """
        Test the POST /users endpoint.
        """
        logger.info("Testing POST /users")
        response = self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'John Doe')
        self.assertEqual(data['hoursWorked'], 0)
        logger.info("POST /users passed")

    def test_get_user_by_id(self):
        """
        Test the GET /users/:id endpoint.
        """
        # clean the users
        self.app.delete('/users')
        logger.info("Testing GET /users/1")
        self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        response = self.app.get('/users/1')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'John Doe')
        self.assertEqual(data['hoursWorked'], 0)
        logger.info("GET /users/1 passed")

    def test_get_non_existent_user(self):
        """
        Test the GET /users/:id endpoint for a non-existent user.
        """
        logger.info("Testing GET /users/999 for non-existent user")
        response = self.app.get('/users/999')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data.decode(), 'User not found')
        logger.info("GET /users/999 passed")

    def test_update_user(self):
        """
        Test the PUT /users/:id endpoint.
        """
        logger.info("Testing PUT /users/1")
        self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        response = self.app.put(
            '/users/1', data=json.dumps({'name': 'Jane Doe'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'Jane Doe')
        logger.info("PUT /users/1 passed")

    def test_update_user_hours(self):
        """
        Test the PATCH /users/:id endpoint.
        """
        logger.info("Testing PATCH /users/1")
        self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        response = self.app.patch(
            '/users/1', data=json.dumps({'hoursToAdd': 5}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['hoursWorked'], 5)
        logger.info("PATCH /users/1 passed")

    def test_delete_user(self):
        """
        Test the DELETE /users/:id endpoint.
        """
        logger.info("Testing DELETE /users/1")
        self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        response = self.app.delete('/users/1')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], 1)
        logger.info("DELETE /users/1 passed")

    def test_delete_all_users(self):
        """
        Test the DELETE /users endpoint.
        """
        logger.info("Testing DELETE /users")
        self.app.post(
            '/users', data=json.dumps({'name': 'John Doe'}), content_type='application/json')
        response = self.app.delete('/users')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data), [])
        logger.info("DELETE /users passed")


if __name__ == '__main__':
    unittest.main()
