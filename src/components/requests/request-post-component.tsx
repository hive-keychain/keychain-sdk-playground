import { Post } from "keychain-sdk/dist/interfaces/keychain-sdk.interface";
import { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { fieldToolTipText } from "../../reference-data/form-field-tool-tip-text";
import CustomToolTip from "../common_ui/custom-tool-tip";
import { CommonProps, KeychainOptions } from "../routes/request-card";

type Props = {};

const DEFAULT_OPTIONS: KeychainOptions = {};

const undefinedParamsToValidate = ["title", "parent_username", "rpc"];

const RequestPostComponent = ({
  setRequestResult,
  setFormParamsToShow,
  sdk,
  lastUsernameFound,
}: Props & CommonProps) => {
  const DEFAULT_PARAMS: Post = {
    username: lastUsernameFound,
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
      author: lastUsernameFound,
      permlink: "a-post-by-keychaintests-fourth-part-post",
      max_accepted_payout: "10000.000 HBD",
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [],
      percent_hbd: 63,
    }),
  };
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
            <InputGroup.Text>Username</InputGroup.Text>
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
              toolTipText={fieldToolTipText.username}
            >
              <Form.Control
                placeholder="Hive username"
                name="username"
                value={formParams.data.username}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Title</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Title of post. Can be undefined"}
            >
              <Form.Control
                placeholder="Title of post. Can be undefined"
                name="title"
                value={formParams.data.title}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Body</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Body of post. You use canMarkdown or text"}
            >
              <Form.Control
                as={"textarea"}
                rows={3}
                placeholder="Body of post. Markdown or text"
                name="body"
                value={formParams.data.body}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Parent perm</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Main tag for a root post"}
            >
              <Form.Control
                placeholder="Permlink of the parent post."
                name="parent_perm"
                value={formParams.data.parent_perm}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Json metadata</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={"Parameters of the call"}
            >
              <Form.Control
                placeholder="Parameters of the call"
                name="json_metadata"
                value={formParams.data.json_metadata}
                onChange={handleFormParams}
              />
            </CustomToolTip>
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
            <InputGroup.Text className="normal">@</InputGroup.Text>{" "}
            <CustomToolTip
              placement="top"
              toolTipText={
                "Author of the parent's post. Pass undefined for root post"
              }
            >
              <Form.Control
                placeholder="Author of the parent post."
                name="parent_username"
                value={formParams.data.parent_username}
                onChange={handleFormParams}
              />
            </CustomToolTip>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Comment options</InputGroup.Text>
            <CustomToolTip
              placement="top"
              toolTipText={
                "Consult Hive documentation at https://developers.hive.io/apidefinitions/#broadcast_ops_comment_options to learn more about it. Note: Must be the same as data.permlink if is a Post."
              }
            >
              <Form.Control
                placeholder="Options attached to the blog post"
                name="comment_options"
                value={formParams.data.comment_options}
                onChange={handleFormParams}
              />
            </CustomToolTip>
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
