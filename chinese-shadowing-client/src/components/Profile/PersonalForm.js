import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';

import { Form, withFormik } from 'formik';
import TextBox from '@controls/TextBox';
import Select from '@controls/Select';
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  Slider,
} from '@material-ui/core';
import {
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@material-ui/icons';
import AvatarEditor from 'react-avatar-editor';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  avatarBadge: {
    '& .MuiBadge-anchorOriginBottomRightRectangle': {
      right: '0.3rem',
      bottom: '0.5rem',
    },
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

function PersonalForm({ user, values, dirty, isSubmitting, setFieldValue }) {
  const [editingAvatar, setEditingAvatar] = React.useState(false);
  const [avatarUploadUrl, setAvatarUploadUrl] = React.useState(null);
  const [avatarScale, setAvatarScale] = React.useState(2);

  /** @type {React.Ref<AvatarEditor>} */
  const avatarEditorRef = React.useRef();

  React.useEffect(() => () => {
    URL.revokeObjectURL(avatarUploadUrl);
    // eslint-disable-next-line
  }, []);

  const classes = useStyles();

  const handleCloseAvatar = () => {
    setEditingAvatar(false);
  };

  const handleAvatarUpload = e => {
    const url = URL.createObjectURL(e.target.files[0]);
    setAvatarUploadUrl(url);
    setEditingAvatar(true);
  };

  const handleAvatarScale = (e, value) => {
    setAvatarScale(value);
  };

  const handleCancelAvatar = () => {
    setEditingAvatar(false);
    setAvatarUploadUrl(null);
    setAvatarScale(2);
  };

  const handleAcceptAvatar = () => {
    const canvas = avatarEditorRef.current.getImage();
    setFieldValue('avatarUrl', canvas.toDataURL('image/jpeg', 80));
    handleCancelAvatar();
  };

  return (
    <Form>

      <label htmlFor="avatarUpload">
        <IconButton component="span">
          <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            className={classes.avatarBadge}
            badgeContent={<CloudUploadIcon color="primary" fontSize="large" />}
          >
            <Avatar
              alt={user.displayName}
              src={values.avatarUrl}
              className={classes.avatar}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
          </Badge>
        </IconButton>
      </label>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="avatarUpload"
        type="file"
        onChange={handleAvatarUpload}
      />

      <Dialog open={editingAvatar} onClose={handleCloseAvatar}>
        <DialogContent>

          <AvatarEditor
            ref={avatarEditorRef}
            scale={avatarScale}
            style={{ width: '100%', height: 'auto' }}
            borderRadius={100}
            image={avatarUploadUrl}
          />
          <Slider
            value={avatarScale}
            min={0}
            max={4}
            step={0.01}
            onChange={handleAvatarScale}
          />

        </DialogContent>
        <DialogActions className={classes.dialogActions}>

          <IconButton color="secondary" onClick={handleCancelAvatar}>
            <CancelIcon />
          </IconButton>

          <IconButton color="primary" onClick={handleAcceptAvatar}>
            <CheckCircleIcon />
          </IconButton>

        </DialogActions>
      </Dialog>

      <Grid container>
        <Grid item xs={6}>
          <TextBox name="displayName" label="Display Name" />
          <Select name="gender" label="Gender">
            <MenuItem value="Unspecified">Unspecified</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={!dirty || isSubmitting}
      >
        {isSubmitting && <CircularProgress />}
        Save Changes
      </Button>
    </Form>
  );
}

export default withFormik({
  mapPropsToValues: ({ user }) => ({
    avatarUrl: user.avatarUrl || '',
    displayName: user.displayName || '',
    gender: user.gender || '',
  }),
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    displayName: Yup
      .string()
      .matches(/^[a-z0-9]{1}.*[a-z0-9]$/i, 'Must start and end with a letter or number.')
      .matches(/^[\w\s]*$/, 'Cannot have special characters.')
      .required('Required'),
    gender: Yup
      .string()
      .oneOf(['Unspecified', 'Male', 'Female'], 'Invalid Selection')
      .required('Required'),
  }),
  handleSubmit: async (values, bag) => {
    bag.setSubmitting(true);
    await bag.props.onSave(values);
    bag.setSubmitting(false);
    bag.resetForm();
  },
})(PersonalForm);
