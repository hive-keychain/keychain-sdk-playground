import { Post } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_PARAMS: Post = {
  username: localStorage.getItem("last_username") || "keychain.tests",
  title: "Keychain Playground SDK",
  body: "## This is a blog post n And this is some text. Testing the brand new Keychain SDK v1.0",
  parent_perm: "blog",
  parent_username: undefined,
  json_metadata: JSON.stringify({
    format: "markdown",
    description: "A blog post",
    tags: ["Blog"],
  }),
  permlink: "a-permlink-post-sample",
  comment_options: JSON.stringify({
    author: localStorage.getItem("last_username") || "keychain.tests",
    permlink: "a-post-by-keychaintests-fourth-part-post",
    max_accepted_payout: "10000.000 SBD",
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: [],
    percent_hbd: 63,
  }),
};
const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = ["title", "parent_username", "rpc"];

const RequestPostComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
}: Props & CommonProps) => {
  const [formParams, setFormParams] = useState<{
    data: Post;
    options: KeychainOptions;
  }>({
    data: DEFAULT_PARAMS,
    options: DEFAULT_OPTIONS,
  });

  useEffect(() => {
    setFormParamsToShow(formParams);
  }, [formParams]);

  const handleFormParams = (e: any) => {
    const { name, value } = e.target;
    const tempValue =
      undefinedParamsToValidate.findIndex((param) => param === name) !== -1 &&
      value.trim() === ""
        ? undefined
        : value;
    if (
      Object.keys(formParams.data).findIndex((param) => param === name) !== -1
    ) {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        data: { ...prevFormParams.data, [name]: tempValue },
      }));
    } else {
      setFormParams((prevFormParams) => ({
        ...prevFormParams,
        options: { ...prevFormParams.options, [name]: tempValue },
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("about to process ...: ", { formParams });
    try {
      const post = await sdk.post(formParams.data, formParams.options);
      setRequestResult(post);
      console.log({ post });
    } catch (error) {
      setRequestResult(error);
    }
  };

  return (
    <Card className="d-flex justify-content-center">
      <Card.Header as={"h5"}>Request Post</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>@</InputGroup.Text>
            <Form.Control
              placeholder="Hive username"
              name="username"
              value={formParams.data.username}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Title</InputGroup.Text>
            <Form.Control
              placeholder="Title of post. Can be undefined"
              name="title"
              value={formParams.data.title}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Body</InputGroup.Text>
            <Form.Control
              as={"textarea"}
              rows={3}
              placeholder="Body of post. Markdown or text"
              name="body"
              value={formParams.data.body}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Parent perm</InputGroup.Text>
            <Form.Control
              placeholder="Permlink of the parent post. Main tag for a root post"
              name="parent_perm"
              value={formParams.data.parent_perm}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Json metadata</InputGroup.Text>
            <Form.Control
              placeholder="Parameters of the call"
              name="json_metadata"
              value={formParams.data.json_metadata}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Permlink</InputGroup.Text>
            <Form.Control
              placeholder="Permlink of post"
              name="permlink"
              value={formParams.data.permlink}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Parent username</InputGroup.Text>
            <Form.Control
              placeholder="Author of the parent post. Pass undefined for root post"
              name="parent_username"
              value={formParams.data.parent_username}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Comment options</InputGroup.Text>
            <Form.Control
              title="Options attached to the blog post, must be stringyfied. Consult Hive documentation at https://developers.hive.io/apidefinitions/#broadcast_ops_comment_options to learn more about it. Note: Must be the same as data.permlink if is a Post."
              placeholder="Options attached to the blog post"
              name="comment_options"
              value={formParams.data.comment_options}
              onChange={handleFormParams}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Rpc</InputGroup.Text>
            <Form.Control
              placeholder="Rpc node to broadcast - optional"
              name="rpc"
              value={formParams.options.rpc}
              onChange={handleFormParams}
            />
          </InputGroup>
          <Button variant="primary" type="submit" className="mt-1">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestPostComponent;
